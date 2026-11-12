export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteSettings = {
  /** Block right-click / drag-to-save on gallery images (copyright deterrent). */
  protectImages: true,
};

/** localStorage key for the visitor's theme choice — per guide, since all guides share one domain. */
export const themeStorageKey = (guideSlug: string) => `guide-theme:${guideSlug}`;

/** Inline script that applies the saved theme before first paint (no flash). */
export const themeScript = (guideSlug: string) =>
  `try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey(guideSlug))});if(t==="guide-sky"||t==="italia"||t==="ceylon-night")document.documentElement.dataset.theme=t}catch(e){}`;

export const sectionIds = [
  "home",
  "about",
  "expertise",
  "itineraries",
  "testimonials",
  "gallery",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

/** Resize an Unsplash / Sanity CDN URL for contexts that bypass next/image (OG tags, JSON-LD). */
export function sizedImage(url: string, w: number, h?: number) {
  if (!url.startsWith("https://images.unsplash.com/") && !url.startsWith("https://cdn.sanity.io/images/")) return url;
  const u = new URL(url);
  u.searchParams.set("w", String(w));
  if (h) {
    u.searchParams.set("h", String(h));
    u.searchParams.set("fit", "crop");
  }
  u.searchParams.set("q", "75");
  return u.toString();
}

/** wa.me deep link with a prefilled message; `{name}` in the template becomes the guide's first name. */
export function whatsappLink(number: string, template: string, guideName: string) {
  const text = template.replace("{name}", guideName.split(/\s+/)[0] ?? "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
