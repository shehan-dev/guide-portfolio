"use client";

import { fmt, ui } from "@/content/ui";
import Flag from "./Flag";
import { IconStar } from "./Icons";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "./SiteProvider";
import styles from "./Testimonials.module.css";

/** Wall of quotes in columns: every review visible at once, no carousel. */
export default function Testimonials() {
  const { testimonials } = useContent();
  if (testimonials.length === 0) return null; // no testimonials in the CMS yet

  const dateFmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

  return (
    <section id="testimonials" className="section" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading id="testimonials-title" kicker={ui.testimonials.kicker} title={ui.testimonials.title} center />

        <RevealGroup className={styles.grid} stagger={0.08}>
          {testimonials.map((t) => (
            <RevealItem key={t.id} className={styles.cell}>
              <figure className={styles.card}>
                <div className={styles.rating} role="img" aria-label={fmt(ui.a11y.rating, { n: t.rating })}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <IconStar key={s} size={15} className={s < t.rating ? styles.starOn : styles.starOff} />
                  ))}
                </div>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>
                    {t.author} {t.countryCode && <Flag code={t.countryCode} label={t.country} size={18} />}
                  </strong>
                  <span>
                    {[t.tour, t.date && dateFmt.format(new Date(t.date))].filter(Boolean).join(" · ")}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
