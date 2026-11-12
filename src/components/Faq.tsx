"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FaqItem } from "@/content/types";
import { ui } from "@/content/ui";
import { whatsappLink } from "@/lib/site";
import { IconChevronDown, IconWhatsApp } from "./Icons";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "./SiteProvider";
import { motionTokens } from "@/lib/motion";
import styles from "./Faq.module.css";

export default function Faq() {
  const { faqs, guide } = useContent();
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const waLink = whatsappLink(guide.contact.whatsapp, ui.contact.whatsappMessage, guide.name);
  if (faqs.length === 0) return null;

  // Two independent columns, so opening a question never shifts the other column.
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)].filter((c) => c.length > 0);

  const renderItem = (f: FaqItem, i: number) => {
    const isOpen = open === f.id;
    return (
      <Reveal key={f.id} className={styles.item} data-open={isOpen || undefined} delay={i * 0.06}>
        <h3 className={styles.q}>
          <button
            type="button"
            id={`faq-btn-${f.id}`}
            aria-expanded={isOpen}
            aria-controls={`faq-panel-${f.id}`}
            onClick={() => setOpen(isOpen ? null : f.id)}
          >
            <span>{f.question}</span>
            <IconChevronDown size={20} className={styles.chevron} />
          </button>
        </h3>
        {/* sync: the panel collapses in place; the one deliberate height animation */}
        <AnimatePresence mode="sync" initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-panel-${f.id}`}
              role="region"
              aria-labelledby={`faq-btn-${f.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
              className={styles.panel}
            >
              <p>{f.answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    );
  };

  return (
    <section id="faq" className="section section--surface" aria-labelledby="faq-title">
      <div className="container">
        {/* Title left, WhatsApp shortcut right, questions in two columns below. */}
        <div className="section-row">
          <SectionHeading id="faq-title" kicker={ui.faq.kicker} title={ui.faq.title} />
          <a className="btn btn--outline" href={waLink} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={18} /> {ui.contact.whatsapp}
          </a>
        </div>

        <div className={styles.columns}>
          {columns.map((col, c) => (
            <div key={c} className={styles.list}>
              {col.map((f, i) => renderItem(f, i))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
