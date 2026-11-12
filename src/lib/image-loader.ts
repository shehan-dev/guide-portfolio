"use client";

/*
 * Global next/image loader (wired in next.config.ts → images.loaderFile).
 * Unsplash (imgix) and Sanity image URLs are resized by their own CDNs, so
 * responsive `srcset`s are generated without routing multi-megabyte
 * originals through the Next.js image optimizer.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
    return url.toString();
  }
  if (src.startsWith("https://cdn.sanity.io/images/")) {
    const url = new URL(src);
    // Keep the crop's aspect ratio when the URL carries both w and h.
    const w = Number(url.searchParams.get("w"));
    const h = Number(url.searchParams.get("h"));
    if (w && h) url.searchParams.set("h", String(Math.round((h * width) / w)));
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
    return url.toString();
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
