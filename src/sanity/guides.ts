/*
 * Guide registry: URL slug → that guide's Sanity project.
 *
 *   NEXT_PUBLIC_GUIDES={"nishan-silva":{"projectId":"abc12345","dataset":"production"}}
 *
 * domain.lk/<slug> serves the guide's site and domain.lk/studio/<slug> their
 * Studio workspace. Project IDs aren't secret; the Studio needs them in the
 * browser, hence one NEXT_PUBLIC_ variable (Next.js only inlines env vars
 * referenced by their exact name).
 *
 * Relative imports only in src/sanity/* — the Sanity CLI loads this folder too.
 */

export interface GuideConfig {
  projectId: string;
  dataset: string;
}

/** Slugs that would collide with app routes. */
const RESERVED = new Set(["studio", "api", "_next", "favicon.ico", "icon.svg", "robots.txt", "sitemap.xml"]);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROJECT_ID_RE = /^[a-z0-9-]+$/;

/** With no registry configured, one "demo" guide renders the bundled dummy content. */
export const DEMO_SLUG = "demo";

/**
 * Parses NEXT_PUBLIC_GUIDES. Called lazily by the Sanity CLI scripts (after
 * they load .env); the app uses the `guides` constant below.
 */
export function readGuides(raw: string | undefined = process.env.NEXT_PUBLIC_GUIDES): Record<string, GuideConfig> {
  if (!raw?.trim()) return { [DEMO_SLUG]: { projectId: "", dataset: "production" } };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("NEXT_PUBLIC_GUIDES is not valid JSON. Keep it on one line, e.g. {\"nishan-silva\":{\"projectId\":\"abc12345\",\"dataset\":\"production\"}}");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("NEXT_PUBLIC_GUIDES must be a JSON object of slug → { projectId, dataset }.");
  }

  const out: Record<string, GuideConfig> = {};
  for (const [slug, value] of Object.entries(parsed as Record<string, Partial<GuideConfig>>)) {
    if (!SLUG_RE.test(slug) || RESERVED.has(slug)) {
      throw new Error(`NEXT_PUBLIC_GUIDES: "${slug}" is not a valid guide slug (lowercase letters, digits and hyphens; not a reserved route).`);
    }
    if (!value?.projectId || !PROJECT_ID_RE.test(value.projectId)) {
      throw new Error(`NEXT_PUBLIC_GUIDES: "${slug}" needs a valid projectId.`);
    }
    out[slug] = { projectId: value.projectId, dataset: value.dataset || "production" };
  }
  return out;
}

export const guides = readGuides();
export const guideSlugs = Object.keys(guides);

export const isGuideSlug = (slug: string): boolean => Object.prototype.hasOwnProperty.call(guides, slug);

/** True when the guide is connected to a Sanity project (the demo guide isn't). */
export const hasSanity = (config: GuideConfig | undefined): config is GuideConfig =>
  !!config && PROJECT_ID_RE.test(config.projectId);

/** Cache tag for everything fetched for one guide; the webhook expires it. */
export const guideTag = (slug: string) => `guide:${slug}`;

/** Server-only: per-guide webhook secret, e.g. SANITY_REVALIDATE_SECRET_NISHAN_SILVA. */
export function revalidateSecretFor(slug: string): string | undefined {
  return process.env[`SANITY_REVALIDATE_SECRET_${slug.toUpperCase().replace(/-/g, "_")}`];
}
