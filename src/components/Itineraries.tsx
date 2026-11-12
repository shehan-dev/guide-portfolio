"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { ExpertiseId } from "@/content/types";
import { fmt, ui } from "@/content/ui";
import { motionTokens, usePointerEffects } from "@/lib/motion";
import { IconChevronLeft, IconChevronRight, IconClock } from "./Icons";
import IslandMap from "./IslandMap";
import Magnetic from "./Magnetic";
import Photo from "./Photo";
import SectionHeading from "./SectionHeading";
import { useContent, useSite } from "./SiteProvider";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./Itineraries.module.css";

/** Flat full-width band with a scroll-snap slideshow: swipe, trackpad, arrows or keyboard. */
export default function Itineraries() {
  const { itineraryFilter, setItineraryFilter } = useSite();
  const { expertise, galleryById, itineraries } = useContent();
  const visible = itineraryFilter === "all" ? itineraries : itineraries.filter((it) => it.tags.includes(itineraryFilter));
  const filters: (ExpertiseId | "all")[] = ["all", ...expertise.map((e) => e.id)];
  const filterLabel = (id: ExpertiseId | "all") => (id === "all" ? ui.itineraries.all : expertise.find((e) => e.id === id)?.title ?? id);

  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const count = visible.length;
  const hasSlides = count > 0;

  const slideAt = (i: number) => trackRef.current?.children[i] as HTMLElement | undefined;
  /** The track is full-bleed with padding that lines the first slide up with the page container. */
  const padLeft = (track: HTMLElement) => parseFloat(getComputedStyle(track).paddingLeft) || 0;

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const target = slideAt(i);
    if (!track || !target) return;
    // Reduced motion: jump straight to the slide instead of gliding.
    track.scrollTo({ left: target.offsetLeft - padLeft(track), behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  // Keep the counter in sync with whatever scrolled the track (swipe, trackpad, arrows).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = [...track.children] as HTMLElement[];
        const pad = padLeft(track);
        let best = 0;
        let bestDist = Infinity;
        slides.forEach((s, i) => {
          const dist = Math.abs(s.offsetLeft - pad - track.scrollLeft);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        // At the very end the last slide may not reach the left edge.
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) best = slides.length - 1;
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [hasSlides]); // re-attach when the track re-renders after an empty filter

  // A new filter starts the slideshow from the beginning.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setIndex(0);
  }, [itineraryFilter]);

  const atStart = index <= 0;
  const atEnd = index >= count - 1;

  /* Mouse drag-to-scroll (touch and trackpads already scroll natively). On release
     it snaps to the nearest slide, biased toward the drag direction. */
  const pointerFx = usePointerEffects();
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const nearestIndex = (track: HTMLElement) => {
    const pad = padLeft(track);
    let best = 0;
    let bestDist = Infinity;
    ([...track.children] as HTMLElement[]).forEach((el, i) => {
      const dist = Math.abs(el.offsetLeft - pad - track.scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  };
  const onDragStart = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const track = e.currentTarget;
    drag.current = { x: e.clientX, left: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
    track.dataset.dragging = "true";
  };
  const onDragMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    e.currentTarget.scrollLeft = d.left - dx;
  };
  const onDragEnd = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const track = e.currentTarget;
    const dx = e.clientX - d.x;
    let target = nearestIndex(track);
    if (Math.abs(dx) > 60 && target === index) target = index + (dx < 0 ? 1 : -1); // a short fling still moves one slide
    goTo(Math.max(0, Math.min(count - 1, target)));
    window.setTimeout(() => delete track.dataset.dragging, 450); // re-enable snapping once the glide settles
    if (d.moved) {
      // A drag must not also click the link/button it started on.
      track.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
    }
  };

  /* "Drag" cursor hint that follows the mouse over the slides (hidden over buttons). */
  const hintX = useSpring(useMotionValue(0), motionTokens.spring);
  const hintY = useSpring(useMotionValue(0), motionTokens.spring);
  const [hint, setHint] = useState(false);
  const onHintMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointerFx) return;
    const r = e.currentTarget.getBoundingClientRect();
    hintX.set(e.clientX - r.left);
    hintY.set(e.clientY - r.top);
    const overControl = !!(e.target as HTMLElement).closest("a, button");
    setHint(!overControl);
  };

  return (
    <section id="itineraries" className={`section ${styles.band}`} aria-labelledby="itineraries-title">
      <div className="container">
        <SectionHeading id="itineraries-title" kicker={ui.itineraries.kicker} title={ui.itineraries.title} intro={ui.itineraries.intro} />

        <div className={`chip-row ${styles.filters}`} role="group" aria-label={ui.nav.expertise}>
          {filters.map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={itineraryFilter === f} onClick={() => setItineraryFilter(f)}>
              {filterLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {count === 0 ? (
        <div className="container">
          <p className={styles.empty}>{ui.itineraries.none}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
          role="region"
          aria-roledescription="carousel"
          aria-label={ui.itineraries.title}
        >
          <div className={styles.trackWrap} onPointerMove={onHintMove} onPointerLeave={() => setHint(false)}>
            {pointerFx && (
              <motion.span
                className={styles.hint}
                aria-hidden
                style={{ x: hintX, y: hintY }}
                initial={false}
                animate={{ opacity: hint ? 1 : 0, scale: hint ? 1 : 0.6 }}
                transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.sharp }}
              >
                {ui.itineraries.drag}
              </motion.span>
            )}
            <ul
              ref={trackRef}
              className={styles.track}
              tabIndex={0}
              data-lenis-prevent-horizontal
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
              onDragStart={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  goTo(index + 1);
                }
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  goTo(index - 1);
                }
              }}
            >
              {visible.map((it, i) => {
                const img = galleryById[it.image];
                const price = `${ui.itineraries.from} USD ${it.priceFrom.toLocaleString("en-US")}${it.priceTo ? `–${it.priceTo.toLocaleString("en-US")}` : ""}`;
                return (
                  <li key={it.id} className={styles.slide} aria-roledescription="slide" aria-label={`${i + 1} / ${count}: ${it.title}`}>
                    <div className={styles.media}>
                      {img && <Photo src={img.url} alt={img.title} fill sizes="(min-width: 1000px) 50vw, 90vw" draggable={false} />}
                      <span className={styles.duration}>
                        <IconClock size={14} /> {it.duration}
                      </span>
                    </div>

                    <div className={styles.body}>
                      <div className={styles.tags}>
                        {it.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {filterLabel(tag)}
                          </span>
                        ))}
                      </div>
                      <h3>{it.title}</h3>
                      <p className={styles.highlights}>{it.highlights.join(" · ")}</p>
                      <p className={styles.desc}>{it.description}</p>

                      <div className={styles.footer}>
                        <IslandMap
                          stops={it.stops}
                          className={styles.map}
                          label={fmt(ui.itineraries.mapLabel, { stops: it.stops.map((s) => s.name).join(", ") })}
                        />
                        <div className={styles.meta}>
                          <p className={styles.price}>{price}</p>
                          <WhatsAppButton
                            className="btn btn--primary btn--sm"
                            message={fmt(ui.itineraries.whatsappMessage, { itinerary: it.title, duration: it.duration })}
                          >
                            {ui.itineraries.book}
                          </WhatsAppButton>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={`container ${styles.bar}`}>
            <div className={styles.progress} aria-hidden>
              <span style={{ transform: `scaleX(${count ? (index + 1) / count : 0})` }} />
            </div>
            <span className={styles.counter} aria-live="polite">
              {String(Math.min(index + 1, Math.max(count, 1))).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <Magnetic strength={0.35}>
              <button type="button" className={styles.arrow} onClick={() => goTo(index - 1)} disabled={atStart} aria-label={ui.a11y.previous}>
                <IconChevronLeft />
              </button>
            </Magnetic>
            <Magnetic strength={0.35}>
              <button type="button" className={styles.arrow} onClick={() => goTo(index + 1)} disabled={atEnd} aria-label={ui.a11y.next}>
                <IconChevronRight />
              </button>
            </Magnetic>
          </div>
        </motion.div>
      )}
    </section>
  );
}
