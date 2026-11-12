import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient, defineQuery } from "next-sanity";
import { cache } from "react";
import { staticContent } from "../content/guide";
import type {
  Credential,
  ExpertiseField,
  ExpertiseId,
  FaqItem,
  GalleryImage,
  GuideProfile,
  ItinerarySample,
  LanguageSkill,
  SiteContent,
  Testimonial,
  ThemeName,
} from "../content/types";
import { apiVersion } from "./env";
import { guides, guideTag, hasSanity, type GuideConfig } from "./guides";

/*
 * Loads one guide's content (one GROQ query against that guide's own Sanity
 * project) and maps it to the app's content types. A guide without a Sanity
 * project (the "demo" guide), or whose dataset has no guide profile yet, gets
 * the bundled dummy content from src/content/guide.ts.
 */

type SanityClient = ReturnType<typeof createClient>;
type ImageUrlFn = (image: Raw | undefined, width: number, height?: number) => string | undefined;

const clients = new Map<string, SanityClient>();
function clientFor({ projectId, dataset }: GuideConfig): SanityClient {
  const key = `${projectId}/${dataset}`;
  let client = clients.get(key);
  if (!client) {
    client = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });
    clients.set(key, client);
  }
  return client;
}

/** Sanity image → CDN URL honouring the editor's crop/hotspot. The image loader rescales w/h per srcset width. */
function imageUrlFor({ projectId, dataset }: GuideConfig): ImageUrlFn {
  const builder = createImageUrlBuilder({ projectId, dataset });
  return (image, width, height) => {
    if (!image?.asset) return undefined;
    let b = builder.image(image).width(width).auto("format");
    if (height) b = b.height(height).fit("crop");
    return b.url();
  };
}

const ordered = "| order(coalesce(order, 1000) asc, _createdAt asc)";

const CONTENT_QUERY = defineQuery(`{
  "guide": *[_id == "guideProfile"][0],
  "credentials": *[_type == "credential"] ${ordered} {..., "fileUrl": file.asset->url},
  "gallery": *[_type == "galleryImage" && defined(image.asset)] ${ordered},
  "expertise": *[_type == "expertise"] ${ordered} {..., "imageIds": images[]._ref},
  "itineraries": *[_type == "itinerary"] ${ordered} {..., "imageId": image._ref},
  "testimonials": *[_type == "testimonial"] | order(date desc) {..., "videoUrl": video.asset->url},
  "faqs": *[_type == "faq"] ${ordered}
}`);

/*
 * When Studio edits reach the site (only *published* changes are read):
 * - development: never cached, so a page refresh shows the latest content;
 * - production: instantly via the Sanity webhook → /api/revalidate, and at
 *   most REVALIDATE_SECONDS later even without the webhook (background
 *   regeneration: the next visitor after that window gets the fresh page).
 */
const REVALIDATE_SECONDS = 60;
const cacheOptions = (slug: string) =>
  process.env.NODE_ENV === "development" ? { revalidate: 0 } : { tags: [guideTag(slug)], revalidate: REVALIDATE_SECONDS };

/** Content for the guide at domain/<slug>. Callers check the slug with isGuideSlug() first. */
export const getSiteContent = cache(async (slug: string): Promise<SiteContent> => {
  const config = guides[slug];
  if (!hasSanity(config)) return staticContent;
  // Fetch errors are thrown on purpose: a failed build/revalidation keeps the
  // last good page instead of silently publishing the dummy content.
  const raw = await clientFor(config).fetch<Raw>(CONTENT_QUERY, {}, { next: cacheOptions(slug) });
  if (!raw?.guide) {
    console.warn(`[sanity] "${slug}" has no guideProfile document yet — showing bundled fallback content. Seed it or create it in /studio/${slug}.`);
    return staticContent;
  }
  return mapContent(raw, imageUrlFor(config));
});

/* ------------------------------------------------------------------------ */
/* Mapping                                                                    */
/* ------------------------------------------------------------------------ */

// GROQ results are untyped here; every field is normalised defensively so a
// half-filled document in the Studio can't crash the site.
type Raw = Record<string, any>;

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const arr = <T = Raw>(v: unknown): T[] => (Array.isArray(v) ? (v.filter(Boolean) as T[]) : []);

/**
 * Text field. Also accepts the legacy `{ en, it }` objects from the earlier
 * bilingual schema, so the site keeps working until `npm run migrate:english`
 * has converted existing documents.
 */
function text(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "en" in v) return str((v as Raw).en);
  return "";
}

const ASPECT_HEIGHT = { landscape: 1200, portrait: 2133, square: 1600 } as const;

const THEMES: ThemeName[] = ["guide-sky", "italia", "ceylon-night"];
const EXPERTISE: ExpertiseId[] = ["history", "leisure", "wildlife", "photography"];
const isExpertise = (v: unknown): v is ExpertiseId => EXPERTISE.includes(v as ExpertiseId);

function mapGuide(g: Raw, imageUrl: ImageUrlFn): GuideProfile {
  const c = g.contact ?? {};
  const fallbackHero = staticContent.guide.heroImage;
  return {
    id: str(g._id),
    name: str(g.name),
    slug: str(g.slug?.current),
    title: text(g.title),
    tagline: text(g.tagline),
    availability: text(g.availability),
    shortPitch: text(g.shortPitch),
    pithyLine: text(g.pithyLine),
    heroImage: imageUrl(g.heroImage, 2400) ?? fallbackHero,
    heroImageAlt: text(g.heroImageAlt),
    portrait: imageUrl(g.portrait, 1200, 1500),
    location: text(g.location),
    bio: arr(g.bio).map(text),
    highlights: arr(g.highlights).map(text),
    yearsExperience: num(g.yearsExperience),
    toursLed: num(g.toursLed),
    languages: arr(g.languages).map(
      (l): LanguageSkill => ({
        name: text(l.name),
        code: str(l.code),
        proficiency: ["native", "fluent", "conversational"].includes(l.proficiency) ? l.proficiency : "fluent",
      }),
    ),
    experience: arr(g.experience).map((e) => ({ years: str(e.years), role: text(e.role), place: text(e.place) })),
    licenseNumber: str(g.licenseNumber),
    theme: THEMES.includes(g.theme) ? g.theme : "guide-sky",
    contact: {
      phone: str(c.phone),
      phoneE164: str(c.phoneE164),
      whatsapp: str(c.whatsapp),
      email: str(c.email),
      city: str(c.city),
      countryCode: str(c.countryCode, "LK"),
      responseTime: text(c.responseTime),
    },
    socials: {
      instagram: g.socials?.instagram,
      facebook: g.socials?.facebook,
      tripadvisor: g.socials?.tripadvisor,
      google: g.socials?.google,
    },
    seo: { title: g.seo?.title ? text(g.seo.title) : undefined, description: g.seo?.description ? text(g.seo.description) : undefined },
  };
}

function mapContent(raw: Raw, imageUrl: ImageUrlFn): SiteContent {
  const gallery: GalleryImage[] = arr(raw.gallery).map((g) => {
    const aspect = (["landscape", "portrait", "square"] as const).includes(g.aspect) ? (g.aspect as GalleryImage["aspect"]) : "landscape";
    return {
      id: g._id,
      title: text(g.title),
      url: imageUrl(g.image, 1600, ASPECT_HEIGHT[aspect]) ?? "",
      category: g.category ?? "culture",
      location: str(g.location),
      dateTaken: str(g.dateTaken),
      aspect,
      credit: str(g.credit),
    };
  });

  const expertise: ExpertiseField[] = arr(raw.expertise)
    .filter((e) => isExpertise(e.key))
    .map((e) => ({
      id: e.key,
      title: text(e.title),
      summary: text(e.summary),
      description: text(e.description),
      activities: arr(e.activities).map(text),
      images: arr<string>(e.imageIds),
    }));

  const itineraries: ItinerarySample[] = arr(raw.itineraries).map((it) => ({
    id: it._id,
    title: text(it.title),
    duration: text(it.duration),
    highlights: arr(it.highlights).map(text),
    priceFrom: num(it.priceFrom),
    priceTo: typeof it.priceTo === "number" ? it.priceTo : undefined,
    description: text(it.description),
    tags: arr<unknown>(it.tags).filter(isExpertise),
    stops: arr(it.stops).map((s) => ({ name: str(s.name), lat: num(s.lat), lng: num(s.lng) })),
    image: str(it.imageId),
  }));

  const testimonials: Testimonial[] = arr(raw.testimonials).map((t) => ({
    id: t._id,
    author: str(t.author),
    country: text(t.country),
    countryCode: str(t.countryCode).toUpperCase(),
    rating: Math.min(5, Math.max(1, Math.round(num(t.rating, 5)))) as Testimonial["rating"],
    quote: text(t.quote),
    tour: text(t.tour),
    date: str(t.date),
    photo: imageUrl(t.photo, 160, 160),
    video: t.videoUrl ?? undefined,
  }));

  const credentials: Credential[] = arr(raw.credentials).map((c) => ({
    id: c._id,
    title: text(c.title),
    issuer: text(c.issuer),
    reference: c.reference || undefined,
    year: typeof c.year === "number" ? c.year : undefined,
    kind: ["license", "language", "safety", "membership", "insurance"].includes(c.kind) ? c.kind : "license",
    file: c.fileUrl ?? undefined,
  }));

  const faqs: FaqItem[] = arr(raw.faqs).map((f) => ({ id: f._id, question: text(f.question), answer: text(f.answer) }));

  return { guide: mapGuide(raw.guide, imageUrl), credentials, gallery, expertise, itineraries, testimonials, faqs };
}
