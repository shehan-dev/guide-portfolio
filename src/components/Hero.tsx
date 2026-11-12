"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import type { PointerEvent } from "react";
import { ui } from "@/content/ui";
import { motionTokens, usePointerEffects } from "@/lib/motion";
import { IconArrowRight } from "./Icons";
import Magnetic from "./Magnetic";
import { useContent } from "./SiteProvider";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./Hero.module.css";

const ease = motionTokens.easing.smooth;

/** Letters slide up out of a mask, staggered — ~600ms per letter. */
function SplitText({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  let index = 0;
  return (
    <span aria-hidden className={styles.split}>
      {words.map((word, w) => (
        <span key={w} className={styles.word}>
          {Array.from(word).map((char) => {
            const i = index++;
            return (
              <span key={i} className={styles.mask}>
                <motion.span
                  className={styles.char}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: motionTokens.duration.slow, ease, delay: delay + i * 0.035 }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
          {w < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { guide } = useContent();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Background moves slower than the foreground (subtle parallax).
  const bgY = useTransform(scrollY, [0, 1000], [0, reduce ? 0 : 220]);
  const bgScale = useTransform(scrollY, [0, 1000], [1.05, reduce ? 1.05 : 1.15]);
  const contentY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -60]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Cursor depth: the photo drifts away from the pointer, the name toward it.
  const pointer = usePointerEffects();
  const px = useSpring(useMotionValue(0), motionTokens.spring); // -1 … 1 across the hero
  const py = useSpring(useMotionValue(0), motionTokens.spring);
  const photoX = useTransform(px, (v) => v * -14);
  const photoY = useTransform(py, (v) => v * -10);
  const titleX = useTransform(px, (v) => v * 10);
  const titleY = useTransform(py, (v) => v * 6);
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!pointer) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const nameDelay = 0.2;
  const afterName = nameDelay + guide.name.length * 0.035 + 0.35;

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <motion.div className={styles.bg} style={{ y: bgY, scale: bgScale }}>
        <motion.div className={styles.bgInner} style={{ x: photoX, y: photoY }}>
          <Image
            src={guide.heroImage}
            alt={guide.heroImageAlt}
            title={guide.heroImageAlt}
            fill
            priority
            sizes="100vw"
            quality={80}
            className={styles.bgImage}
          />
        </motion.div>
      </motion.div>
      <div className={styles.overlay} aria-hidden />

      <motion.div className={`container ${styles.content}`} style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.slow, ease }}
        >
          {guide.tagline}
        </motion.p>

        <motion.h1 id="hero-title" className={styles.title} aria-label={guide.name} style={{ x: titleX, y: titleY }}>
          <SplitText text={guide.name} delay={nameDelay} />
        </motion.h1>

        <motion.p
          className={styles.pithy}
          initial={{ opacity: 0, y: motionTokens.distance.md }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.slow, ease, delay: afterName }}
        >
          {guide.pithyLine}
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.slow, ease, delay: afterName + 0.2 }}
        >
          <Magnetic>
            <WhatsAppButton className="btn btn--primary">
              {ui.hero.book} <IconArrowRight size={18} />
            </WhatsAppButton>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={styles.scroll}
        aria-label={ui.a11y.scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: afterName + 0.6, duration: motionTokens.duration.slow }}
      >
        <span className={styles.mouse} aria-hidden>
          <span className={styles.wheel} />
        </span>
        <span className={styles.scrollLabel} aria-hidden>
          {ui.hero.scroll}
        </span>
      </motion.a>
    </section>
  );
}
