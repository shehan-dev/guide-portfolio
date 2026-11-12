import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import SiteProvider from "@/components/SiteProvider";
import { siteUrl, sizedImage, themeScript } from "@/lib/site";
import { getSiteContent } from "@/sanity/content";
import { guideSlugs, isGuideSlug } from "@/sanity/guides";
import { fontVariables } from "../../fonts";
import "lenis/dist/lenis.css";
import "../../globals.css";

/* Root layout for one guide's site: domain/<guide>. Unknown slugs are 404s. */

export const dynamicParams = false;

export function generateStaticParams() {
  return guideSlugs.map((guide) => ({ guide }));
}

type Params = Promise<{ guide: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { guide: slug } = await params;
  if (!isGuideSlug(slug)) return {};
  const { guide } = await getSiteContent(slug);
  const title = guide.seo?.title || `${guide.name} | ${guide.title}`;
  const description = guide.seo?.description || guide.shortPitch;
  const ogImage = sizedImage(guide.heroImage, 1200, 630);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${guide.name}` },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      siteName: guide.name,
      title,
      description,
      url: `/${slug}`,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: guide.heroImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default async function GuideLayout({ children, params }: { children: ReactNode; params: Params }) {
  const { guide: slug } = await params;
  if (!isGuideSlug(slug)) notFound();
  const content = await getSiteContent(slug);

  return (
    <html lang="en" data-theme={content.guide.theme} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript(slug) }} />
      </head>
      <body>
        <SiteProvider content={content} guideSlug={slug}>
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}
