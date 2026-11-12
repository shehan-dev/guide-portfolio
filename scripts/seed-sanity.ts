/*
 * Seeds a Sanity dataset with the bundled dummy content (src/content/guide.ts):
 * uploads the gallery/hero photos and the credential PDF, then creates all
 * documents. Safe to re-run: documents use fixed ids (createOrReplace) and
 * Sanity de-duplicates identical asset uploads.
 *
 *   npm run sanity:login                           # once
 *   $env:GUIDE="nishan-silva"; npm run seed        # PowerShell (GUIDE optional with one guide)
 *
 * Only run this against a NEW dataset — it overwrites documents it created before.
 */
import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { staticContent } from "../src/content/guide";
import { cliGuide } from "../src/sanity/cliGuide";

let target: ReturnType<typeof cliGuide>;
try {
  target = cliGuide();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
const { projectId, dataset } = target.config;

// Passing projectId + dataset explicitly stops getCliClient() from re-loading
// sanity.cli.ts through a nested tsx loader, which fails inside `sanity exec`.
// The login token still comes from `--with-user-token` (SANITY_AUTH_TOKEN).
const client = getCliClient({ apiVersion: "2025-10-01", projectId, dataset });
const { guide, gallery, credentials, expertise, itineraries, testimonials, faqs } = staticContent;

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const ref = (id: string) => ({ _type: "reference", _ref: id });
const galleryId = (id: string) => `gallery-${id}`;

async function uploadImage(url: string, filename: string) {
  const src = `${url}${url.includes("?") ? "&" : "?"}fm=jpg&w=2200&q=85`;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${src}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename });
  return { _type: "image", asset: ref(asset._id) };
}

async function main() {
  console.log(`Seeding "${target.slug}" (${projectId}/${dataset}) …`);

  // 1. Assets
  const galleryImages: Record<string, { _type: string; asset: { _type: string; _ref: string } }> = {};
  for (const g of gallery) {
    process.stdout.write(`  ↑ image ${g.id}\n`);
    galleryImages[g.id] = await uploadImage(g.url, `${g.id}.jpg`);
  }
  process.stdout.write("  ↑ hero image\n");
  const heroImage = await uploadImage(guide.heroImage, "hero.jpg");
  const pdf = await client.assets.upload("file", createReadStream(path.join(process.cwd(), "public/docs/credential-placeholder.pdf")), {
    filename: "credential-placeholder.pdf",
  });

  // 2. Documents
  const docs: Array<{ _id: string; _type: string; [k: string]: unknown }> = [];

  gallery.forEach((g, i) =>
    docs.push({
      _id: galleryId(g.id),
      _type: "galleryImage",
      image: galleryImages[g.id],
      title: g.title,
      category: g.category,
      location: g.location,
      dateTaken: g.dateTaken,
      aspect: g.aspect,
      credit: g.credit,
      order: (i + 1) * 10,
    }),
  );

  docs.push({
    _id: "guideProfile",
    _type: "guideProfile",
    name: guide.name,
    slug: { _type: "slug", current: target.slug },
    title: guide.title,
    tagline: guide.tagline,
    pithyLine: guide.pithyLine,
    shortPitch: guide.shortPitch,
    heroImage,
    heroImageAlt: guide.heroImageAlt,
    location: guide.location,
    bio: guide.bio,
    highlights: guide.highlights,
    yearsExperience: guide.yearsExperience,
    toursLed: guide.toursLed,
    licenseNumber: guide.licenseNumber,
    languages: guide.languages.map((l) => ({ _type: "languageSkill", _key: key(), name: l.name, code: l.code, proficiency: l.proficiency })),
    experience: guide.experience.map((e) => ({ _type: "experienceEntry", _key: key(), years: e.years, role: e.role, place: e.place })),
    contact: {
      phone: guide.contact.phone,
      phoneE164: guide.contact.phoneE164,
      whatsapp: guide.contact.whatsapp,
      email: guide.contact.email,
      city: guide.contact.city,
      countryCode: guide.contact.countryCode,
      responseTime: guide.contact.responseTime,
    },
    socials: guide.socials,
    theme: guide.theme,
    availability: guide.availability,
    ...(guide.seo && {
      seo: {
        ...(guide.seo.title && { title: guide.seo.title }),
        ...(guide.seo.description && { description: guide.seo.description }),
      },
    }),
  });

  expertise.forEach((e, i) =>
    docs.push({
      _id: `expertise-${e.id}`,
      _type: "expertise",
      key: e.id,
      title: e.title,
      summary: e.summary,
      description: e.description,
      activities: e.activities,
      images: e.images.map((id) => ({ ...ref(galleryId(id)), _key: key() })),
      order: (i + 1) * 10,
    }),
  );

  itineraries.forEach((it, i) =>
    docs.push({
      _id: `itinerary-${it.id}`,
      _type: "itinerary",
      title: it.title,
      duration: it.duration,
      highlights: it.highlights,
      description: it.description,
      priceFrom: it.priceFrom,
      ...(it.priceTo && { priceTo: it.priceTo }),
      tags: it.tags,
      stops: it.stops.map((s) => ({ _type: "stop", _key: key(), ...s })),
      image: ref(galleryId(it.image)),
      order: (i + 1) * 10,
    }),
  );

  testimonials.forEach((t) =>
    docs.push({
      _id: `testimonial-${t.id}`,
      _type: "testimonial",
      author: t.author,
      country: t.country,
      countryCode: t.countryCode,
      rating: t.rating,
      quote: t.quote,
      tour: t.tour,
      date: t.date,
    }),
  );

  credentials.forEach((c, i) =>
    docs.push({
      _id: `credential-${c.id}`,
      _type: "credential",
      title: c.title,
      issuer: c.issuer,
      kind: c.kind,
      ...(c.reference && { reference: c.reference }),
      ...(c.year && { year: c.year }),
      file: { _type: "file", asset: ref(pdf._id) },
      order: (i + 1) * 10,
    }),
  );

  faqs.forEach((f, i) =>
    docs.push({ _id: `faq-${f.id}`, _type: "faq", question: f.question, answer: f.answer, order: (i + 1) * 10 }),
  );

  const tx = client.transaction();
  docs.forEach((d) => tx.createOrReplace(d));
  await tx.commit();
  console.log(`✓ Seeded ${docs.length} documents. Open /studio/${target.slug} to edit them.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
