"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryCategory } from "@/content/types";
import { siteSettings } from "@/lib/site";
import { IconChevronLeft, IconChevronRight, IconPin } from "./Icons";
import Modal from "./Modal";
import Photo from "./Photo";
import { useContent } from "./SiteProvider";
import { fmt, ui } from "@/content/ui";
import SectionHeading from "./SectionHeading";
import { motionTokens } from "@/lib/motion";
import styles from "./Gallery.module.css";

const categories: GalleryCategory[] = ["culture", "nature", "food", "portraits", "vehicles"];
const aspectRatio = { portrait: "3 / 4", landscape: "4 / 3", square: "1 / 1" } as const;

/** Props that discourage saving images (right-click / drag) when protection is on. */
const protect = siteSettings.protectImages
  ? { onContextMenu: (e: React.MouseEvent) => e.preventDefault(), draggable: false }
  : {};

export default function Gallery() {
  const { gallery } = useContent();
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const items = filter === "all" ? gallery : gallery.filter((g) => g.category === filter);
  const current = openIndex !== null ? items[openIndex] : null;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

  const step = (delta: number) => {
    setDirection(delta);
    setOpenIndex((i) => (i === null ? i : (i + delta + items.length) % items.length));
  };

  // Arrow-key navigation while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  return (
    <section id="gallery" className="section section--surface" aria-labelledby="gallery-title">
      <div className="container">
        {/* Title left, filters right on the same row. */}
        <div className="section-row">
          <SectionHeading id="gallery-title" kicker={ui.gallery.kicker} title={ui.gallery.title} />
          <div className={`chip-row ${styles.filters}`} role="group" aria-label={ui.gallery.kicker}>
            {(["all", ...categories] as const).map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c === "all" ? ui.gallery.all : ui.gallery.categories[c]}
              </button>
            ))}
          </div>
        </div>

        <ul className={`${styles.masonry} ${siteSettings.protectImages ? styles.protected : ""}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((img, i) => (
              <motion.li
                key={img.id}
                className={styles.item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
              >
                <button
                  type="button"
                  className={styles.tile}
                  style={{ aspectRatio: aspectRatio[img.aspect] }}
                  onClick={() => {
                    setDirection(0);
                    setOpenIndex(i);
                  }}
                  aria-haspopup="dialog"
                  aria-label={`${img.title}, ${img.location}`}
                  {...protect}
                >
                  <Photo src={img.url} alt="" fill sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 50vw" {...protect} />
                  <span className={styles.caption} aria-hidden>
                    <strong>{img.title}</strong>
                    <span>
                      <IconPin size={13} /> {img.location}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Modal
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        title={current ? current.title : ui.gallery.photo}
        hideTitle
        closeLabel={ui.a11y.close}
        size="full"
        variant="dark"
      >
        {current && (
          <div className={styles.lightbox}>
            <div className={`${styles.stage} ${siteSettings.protectImages ? styles.protected : ""}`}>
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={current.id}
                  className={styles.stageImage}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: d === 0 ? 0.96 : 1 }),
                    center: { opacity: 1, x: 0, scale: 1 },
                    exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) step(1);
                    else if (info.offset.x > 60) step(-1);
                  }}
                >
                  <Image src={current.url} alt={current.title} fill sizes="100vw" quality={85} style={{ objectFit: "contain" }} {...protect} />
                </motion.div>
              </AnimatePresence>
              <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label={ui.a11y.previous}>
                <IconChevronLeft size={26} />
              </button>
              <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label={ui.a11y.next}>
                <IconChevronRight size={26} />
              </button>
            </div>
            <div className={styles.meta}>
              <div>
                <p className={styles.metaTitle}>{current.title}</p>
                <p className={styles.metaSub}>
                  <IconPin size={14} /> {current.location} · {dateFmt.format(new Date(current.dateTaken))} ·{" "}
                  {ui.gallery.categories[current.category]}
                </p>
              </div>
              <p className={styles.counter} aria-live="polite">
                {fmt(ui.gallery.imageOf, { i: (openIndex ?? 0) + 1, n: items.length })}
                <span className={styles.credit}> · {ui.footer.photoCredit}</span>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
