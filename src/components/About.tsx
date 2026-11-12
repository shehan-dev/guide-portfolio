"use client";

import Image from "next/image";
import { ui } from "@/content/ui";
import { initials } from "@/lib/site";
import CountUp from "./CountUp";
import { IconCheck, IconPin, IconShield } from "./Icons";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "./SiteProvider";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./About.module.css";

export default function About() {
  const { guide } = useContent();

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.portraitCol}>
          <div className={styles.portrait}>
            {guide.portrait ? (
              <Image src={guide.portrait} alt={guide.name} fill sizes="(min-width: 900px) 40vw, 90vw" className={styles.portraitImg} />
            ) : (
              // Styled placeholder until the guide's real portrait is provided.
              <div className={styles.placeholder} role="img" aria-label={`${guide.name}, ${ui.about.portraitPlaceholder}`}>
                <span className={styles.initials} aria-hidden>
                  {initials(guide.name)}
                </span>
                <span className={styles.placeholderNote} aria-hidden>
                  {ui.about.portraitPlaceholder}
                </span>
              </div>
            )}
          </div>
        </Reveal>

        <div className={styles.text}>
          <SectionHeading id="about-title" kicker={ui.about.kicker} title={ui.about.title} className={styles.head}>
            {guide.location && (
              <p className={styles.location}>
                <IconPin size={16} /> {guide.location}
              </p>
            )}
          </SectionHeading>

          {guide.bio.map((para, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className={i === 0 ? styles.lead : styles.para}>{para}</p>
            </Reveal>
          ))}

          <Reveal className={styles.stats}>
            <div>
              <strong>
                <CountUp to={guide.yearsExperience} suffix="+" />
              </strong>
              <span>{ui.about.years}</span>
            </div>
            <div>
              <strong>
                <CountUp to={guide.toursLed} suffix="+" />
              </strong>
              <span>{ui.about.tours}</span>
            </div>
            <div>
              <strong>
                <CountUp to={guide.languages.length} />
              </strong>
              <span>{ui.about.languages}</span>
            </div>
          </Reveal>

          {(guide.highlights.length > 0 || guide.licenseNumber) && (
            <Reveal className={styles.callout}>
              <div className={styles.calloutHead}>
                <IconShield size={22} />
                <h3>{ui.about.why}</h3>
              </div>
              {guide.highlights.length > 0 && (
                <ul>
                  {guide.highlights.map((h, i) => (
                    <li key={i}>
                      <IconCheck size={18} /> {h}
                    </li>
                  ))}
                </ul>
              )}
              {guide.licenseNumber && (
                <p className={styles.license}>
                  {ui.about.license} <code>{guide.licenseNumber}</code>
                </p>
              )}
            </Reveal>
          )}

          <Reveal>
            <WhatsAppButton className="btn btn--primary">{ui.about.cta}</WhatsAppButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
