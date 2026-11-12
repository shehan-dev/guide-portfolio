import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ui } from "@/content/ui";
import { getSiteContent } from "@/sanity/content";

const slugs = ["terms", "privacy", "accessibility"] as const;
type Slug = (typeof slugs)[number];
const isSlug = (s: string): s is Slug => (slugs as readonly string[]).includes(s);

export const dynamicParams = false;

export function generateStaticParams() {
  // Combined with the parent layout's guide params.
  return slugs.map((slug) => ({ slug }));
}

type Params = Promise<{ guide: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  return { title: ui.footer.legal[slug], robots: { index: false } };
}

export default async function LegalPage({ params }: { params: Params }) {
  const { guide: guideSlug, slug } = await params;
  if (!isSlug(slug)) notFound();
  const { guide } = await getSiteContent(guideSlug);

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link href={`/${guideSlug}`} className="btn btn--outline btn--sm">
          ← {ui.legal.back}
        </Link>
        <h1 className="section-title" style={{ marginTop: 32 }}>
          {ui.footer.legal[slug]}
        </h1>
        <p className="section-intro">{guide.name}</p>
        <p style={{ marginTop: 24, padding: 20, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
          {ui.legal.placeholder}
        </p>
      </div>
    </main>
  );
}
