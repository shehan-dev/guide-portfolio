"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { ExpertiseField, ExpertiseId } from "@/content/types";
import { ui } from "@/content/ui";
import { IconArrowRight, IconAward, IconCheck } from "./Icons";
import Modal from "./Modal";
import Photo from "./Photo";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent, useSite } from "./SiteProvider";
import Tilt from "./Tilt";
import styles from "./Expertise.module.css";

export default function Expertise() {
  const { setItineraryFilter, scrollToSection } = useSite();
  const { expertise, galleryById, guide } = useContent();
  const [openField, setOpenField] = useState<ExpertiseField | null>(null);

  const showItineraries = (id: ExpertiseId) => {
    setItineraryFilter(id);
    setOpenField(null);
    // Wait for the modal to close (smooth scrolling is paused while it's open).
    window.setTimeout(() => scrollToSection("itineraries"), 260);
  };

  return (
    <section id="expertise" className="section section--surface" aria-labelledby="expertise-title">
      <div className={`container ${styles.layout}`}>
        {/* Left: the title stays in view while the content on the right scrolls past. */}
        <div className={styles.side}>
          <SectionHeading id="expertise-title" kicker={ui.expertise.kicker} title={ui.expertise.title} intro={ui.expertise.intro} />
        </div>

        <div className={styles.main}>
          <h3 className={styles.subhead}>{ui.expertise.languagesTitle}</h3>
          <RevealGroup className={styles.languages} stagger={0.1}>
            {guide.languages.map((l) => (
              <RevealItem key={l.code} className={styles.lang}>
                <span className={styles.langCode} aria-hidden>
                  {l.code.toUpperCase()}
                </span>
                <span className={styles.langBody}>
                  <strong>{l.name}</strong>
                  <span>{ui.expertise.proficiency[l.proficiency]}</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className={styles.fields} stagger={0.1}>
            {expertise.map((field) => {
              const cover = galleryById[field.images[0]];
              return (
                <RevealItem key={field.id} className={styles.cell}>
                  <Tilt className={styles.card}>
                    <div className={styles.cardMedia}>
                      <div className={styles.cardImage}>
                        {cover && <Photo src={cover.url} alt={cover.title} fill sizes="(min-width: 1000px) 30vw, (min-width: 640px) 50vw, 100vw" />}
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3>{field.title}</h3>
                      <p>{field.summary}</p>
                      <button type="button" className={styles.more} onClick={() => setOpenField(field)} aria-haspopup="dialog">
                        {ui.expertise.learnMore} <IconArrowRight size={16} />
                      </button>
                    </div>
                  </Tilt>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>

      <Modal
        open={openField !== null}
        onClose={() => setOpenField(null)}
        title={openField ? openField.title : ""}
        closeLabel={ui.a11y.close}
        size="lg"
      >
        {openField && (
          <div className={styles.modal}>
            <div className={styles.modalImages}>
              {openField.images.map((id, i) => {
                const img = galleryById[id];
                if (!img) return null;
                return (
                  <motion.figure
                    key={id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.4 }}
                  >
                    <Photo src={img.url} alt={img.title} fill sizes="(min-width: 900px) 280px, 33vw" />
                  </motion.figure>
                );
              })}
            </div>
            <p className={styles.modalDesc}>{openField.description}</p>
            <h4 className={styles.modalSub}>
              <IconAward size={18} /> {ui.expertise.sampleActivities}
            </h4>
            <ul className={styles.activityList}>
              {openField.activities.map((a, i) => (
                <li key={i}>
                  <IconCheck size={16} /> {a}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--primary" onClick={() => showItineraries(openField.id)}>
              {ui.expertise.seeItineraries} <IconArrowRight size={18} />
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
