"use client";

import Lenis from "lenis";
import { useEffect, type RefObject } from "react";

/*
 * Inertia-based smooth scrolling (Lenis) for the whole page.
 * - Same-page #anchor links glide to their section (offset for the sticky
 *   header via the CSS `scroll-padding-top`).
 * - Pauses while a modal <dialog> or the mobile menu is open, so the page
 *   behind them stays put and their own content scrolls natively.
 * - Honours prefers-reduced-motion (Lenis falls back to 1:1 instant scrolling).
 */
export default function SmoothScroll({ lenisRef }: { lenisRef: RefObject<Lenis | null> }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      // The sticky-header offset comes from `scroll-padding-top` in globals.css,
      // which Lenis reads when resolving anchor targets.
      anchors: true,
      // Let scrollable overlays handle their own wheel/touch events.
      prevent: (node) => !!node.closest("dialog, #mobile-menu"),
    });
    lenisRef.current = lenis;

    // Stop the page from scrolling under open overlays. The mobile menu flags
    // itself on <html data-menu-open> (cleared as soon as it starts closing).
    const sync = () => {
      const overlayOpen = document.documentElement.hasAttribute("data-menu-open") || !!document.querySelector("dialog[open]");
      if (overlayOpen && !lenis.isStopped) lenis.stop();
      else if (!overlayOpen && lenis.isStopped) lenis.start();
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["open", "data-menu-open"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lenisRef]);

  return null;
}
