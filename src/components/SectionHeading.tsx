"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { motionTokens } from "@/lib/motion";

const ease = motionTokens.easing.smooth;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.md },
  show: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.slow, ease } },
};

const words: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const word: Variants = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: motionTokens.duration.slow, ease } },
};

/** Heading whose words rise out of a mask one after another. Screen readers get the plain text. */
export function AnimatedTitle({
  text,
  id,
  className = "section-title",
  as = "h2",
}: {
  text: string;
  id?: string;
  className?: string;
  /** h1 for a page's main heading; sections use h2. */
  as?: "h1" | "h2";
}) {
  const parts = text.split(" ");
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag id={id} className={className} aria-label={text} variants={words}>
      {parts.map((w, i) => (
        <span key={i} aria-hidden>
          <span className="word-mask">
            <motion.span className="word" variants={word}>
              {w}
            </motion.span>
          </span>
          {i < parts.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}

interface SectionHeadingProps {
  id: string; // heading id, referenced by the section's aria-labelledby
  title: string;
  kicker?: string;
  intro?: string;
  center?: boolean;
  className?: string;
  /** Extra content revealed after the intro (e.g. a button). */
  children?: ReactNode;
}

/** Section label, title and intro that animate in as the section scrolls into view. */
export default function SectionHeading({ id, title, kicker, intro, center, className, children }: SectionHeadingProps) {
  return (
    <motion.div
      className={`section-head${center ? " section-head--center" : ""}${className ? ` ${className}` : ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={container}
    >
      {kicker && (
        <motion.p className="kicker" variants={fadeUp}>
          {kicker}
        </motion.p>
      )}
      <AnimatedTitle id={id} text={title} />
      {intro && (
        <motion.p className="section-intro" variants={fadeUp}>
          {intro}
        </motion.p>
      )}
      {children && <motion.div variants={fadeUp}>{children}</motion.div>}
    </motion.div>
  );
}
