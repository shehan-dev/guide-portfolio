"use client";

import type Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ExpertiseId, GalleryImage, SiteContent } from "@/content/types";
import SmoothScroll from "./SmoothScroll";

interface SiteContextValue {
  /** URL slug of the guide being shown (domain/<guideSlug>). */
  guideSlug: string;
  itineraryFilter: ExpertiseId | "all";
  setItineraryFilter: (id: ExpertiseId | "all") => void;
  /** Smoothly scroll to a section by id (via Lenis when active). */
  scrollToSection: (id: string) => void;
}

type ContentContextValue = SiteContent & { galleryById: Record<string, GalleryImage> };

const SiteContext = createContext<SiteContextValue | null>(null);
const ContentContext = createContext<ContentContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

/** CMS content (Sanity or the bundled fallback), loaded on the server in the layout. */
export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <SiteProvider>");
  return ctx;
}

export default function SiteProvider({
  content,
  guideSlug,
  children,
}: {
  content: SiteContent;
  guideSlug: string;
  children: ReactNode;
}) {
  const [itineraryFilter, setItineraryFilter] = useState<ExpertiseId | "all">("all");

  const lenisRef = useRef<Lenis | null>(null);
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) {
      // An overlay that just closed may still be animating out (Lenis paused).
      lenis.start();
      lenis.scrollTo(el, { force: true });
    } else el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({ guideSlug, itineraryFilter, setItineraryFilter, scrollToSection }),
    [guideSlug, itineraryFilter, scrollToSection],
  );

  const contentValue = useMemo<ContentContextValue>(
    () => ({ ...content, galleryById: Object.fromEntries(content.gallery.map((g) => [g.id, g])) }),
    [content],
  );

  return (
    <SiteContext.Provider value={value}>
      <ContentContext.Provider value={contentValue}>
        {/* Honour the OS "reduce motion" setting for every motion component. */}
        <MotionConfig reducedMotion="user">
          <SmoothScroll lenisRef={lenisRef} />
          {children}
        </MotionConfig>
      </ContentContext.Provider>
    </SiteContext.Provider>
  );
}
