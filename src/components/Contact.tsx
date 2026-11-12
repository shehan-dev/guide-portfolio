"use client";

import { ui } from "@/content/ui";
import { IconArrowRight, IconClock, IconMail, IconPhone, IconWhatsApp } from "./Icons";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "./SiteProvider";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./Contact.module.css";

export default function Contact() {
  const { guide } = useContent();
  const { contact } = guide;

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      {/* Split: the invitation on the left, the ways to book on the right. */}
      <div className={`container ${styles.layout}`}>
        <SectionHeading id="contact-title" kicker={ui.contact.kicker} title={ui.contact.title} intro={ui.contact.intro} className={styles.head} />

        {/* One booking panel: WhatsApp first, call and email as secondary options inside it. */}
        <Reveal className={styles.card}>
          <div className={styles.waRow}>
            <span className={styles.waBadge} aria-hidden>
              <IconWhatsApp size={28} />
            </span>
            <div className={styles.waText}>
              <p className={styles.waLabel}>{ui.contact.whatsapp}</p>
              <p className={styles.waNumber}>{contact.phone}</p>
              {contact.responseTime && (
                <p className={styles.response}>
                  <IconClock size={15} /> {contact.responseTime}
                </p>
              )}
            </div>
          </div>

          <Magnetic className={styles.waMagnet}>
            <WhatsAppButton className={`btn ${styles.waButton}`} icon={false}>
              {ui.contact.cta} <IconArrowRight size={18} />
            </WhatsAppButton>
          </Magnetic>

          <div className={styles.alt}>
            <a className={styles.altLink} href={`tel:${contact.phoneE164}`}>
              <IconPhone size={18} />
              <span>
                <strong>{ui.contact.call}</strong> {contact.phone}
              </span>
            </a>
            <a className={styles.altLink} href={`mailto:${contact.email}`}>
              <IconMail size={18} />
              <span>
                <strong>{ui.contact.email}</strong> {contact.email}
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
