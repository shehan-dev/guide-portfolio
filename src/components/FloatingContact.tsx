"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ui } from "@/content/ui";
import { whatsappLink } from "@/lib/site";
import { IconClose, IconMail, IconPhone, IconWhatsApp } from "./Icons";
import { useContent } from "./SiteProvider";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./FloatingContact.module.css";

/** Persistent speed-dial (WhatsApp / phone / email) plus an always-visible "Book now" pill on mobile. */
export default function FloatingContact() {
  const { guide } = useContent();
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.6));

  // Close on Escape or outside click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const { contact } = guide;
  const actions = [
    {
      key: "wa",
      label: ui.contact.whatsapp,
      href: whatsappLink(contact.whatsapp, ui.contact.whatsappMessage, guide.name),
      icon: <IconWhatsApp size={22} />,
      className: styles.wa,
      external: true,
    },
    { key: "call", label: `${ui.contact.call} ${contact.phone}`, href: `tel:${contact.phoneE164}`, icon: <IconPhone size={20} />, className: "" },
    { key: "mail", label: ui.contact.email, href: `mailto:${contact.email}`, icon: <IconMail size={20} />, className: "" },
  ];

  return (
    <div ref={rootRef} className={`${styles.root} no-print`} data-past-hero={pastHero || undefined}>
      <WhatsAppButton className={`btn btn--primary ${styles.bookPill}`} icon={false}>
        {ui.floating.book}
      </WhatsAppButton>

      <div className={styles.dial}>
        <AnimatePresence mode="wait">
          {open && (
            <motion.ul id="contact-dial" className={styles.actions} initial="hidden" animate="show" exit="hidden" variants={{ show: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }, hidden: { transition: { staggerChildren: 0.03 } } }}>
              {actions.map((a) => (
                <motion.li
                  key={a.key}
                  variants={{ hidden: { opacity: 0, y: 16, scale: 0.6 }, show: { opacity: 1, y: 0, scale: 1 } }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                >
                  <a
                    className={`${styles.action} ${a.className}`}
                    href={a.href}
                    {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.actionLabel}>{a.label}</span>
                    <span className={styles.actionIcon}>{a.icon}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <button
          type="button"
          className={styles.fab}
          aria-expanded={open}
          aria-controls="contact-dial"
          aria-label={open ? ui.a11y.close : ui.floating.open}
          onClick={() => setOpen((o) => !o)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={styles.fabIcon}
            >
              {open ? <IconClose size={24} /> : <IconWhatsApp size={26} />}
            </motion.span>
          </AnimatePresence>
          {!open && <span className={styles.ping} aria-hidden />}
        </button>
      </div>
    </div>
  );
}
