"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { fmt, ui } from "@/content/ui";
import { motionTokens } from "@/lib/motion";
import { isGuideSlug } from "@/sanity/guides";
import { IconArrowRight } from "../Icons";
import { AnimatedTitle } from "../SectionHeading";
import styles from "./Landing.module.css";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.md },
  show: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth } },
};

/** "Nishan Silva" / " /nishan-silva " → "nishan-silva" */
const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^.*\//, "") // a pasted link: keep the last path segment
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Root domain while the main site is in the making: sends visitors to a guide's own link. */
export default function Landing({ host, photo, photoAlt }: { host: string; photo: string; photoAlt: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const slug = toSlug(value);
    if (!slug) return setError(ui.landing.empty);
    if (!isGuideSlug(slug)) return setError(ui.landing.notFound);
    setError(null);
    router.push(`/${slug}`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.photo} aria-hidden>
        <Image src={photo} alt="" fill priority sizes="100vw" quality={80} className={styles.photoImg} />
      </div>
      <div className={styles.shade} aria-hidden />

      <motion.div className={styles.content} initial="hidden" animate="show" variants={stagger}>
        <motion.p className={styles.badge} variants={rise}>
          <span className={styles.pulse} aria-hidden />
          {ui.landing.badge}
        </motion.p>

        <AnimatedTitle as="h1" text={ui.landing.heading} className={styles.title} />

        <motion.p className={styles.intro} variants={rise}>
          {ui.landing.intro}
        </motion.p>

        <motion.form className={styles.finder} onSubmit={onSubmit} variants={rise} noValidate>
          <p className={styles.finderTitle}>{ui.landing.finderTitle}</p>
          <div className={styles.field} data-invalid={error ? true : undefined}>
            <label htmlFor="guide-slug" className={styles.prefix}>
              <span className="visually-hidden">{ui.landing.finderLabel}: </span>
              {host}/
            </label>
            <input
              id="guide-slug"
              className={styles.input}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={ui.landing.placeholder}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "guide-slug-error" : "guide-slug-hint"}
            />
            <button type="submit" className={`btn btn--primary ${styles.go}`}>
              {ui.landing.open} <IconArrowRight size={18} />
            </button>
          </div>
          {error ? (
            <p id="guide-slug-error" className={styles.error} role="alert">
              {error}
            </p>
          ) : (
            <p id="guide-slug-hint" className={styles.hint}>
              {fmt(ui.landing.hint, { host })}
            </p>
          )}
        </motion.form>
      </motion.div>

      <motion.p
        className={styles.credit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: motionTokens.duration.slow }}
      >
        {photoAlt} · {ui.landing.photo}
      </motion.p>
    </main>
  );
}
