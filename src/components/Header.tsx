"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { initials, sectionIds, type SectionId } from "@/lib/site";
import { IconClose, IconMenu, IconPhone } from "./Icons";
import { ui } from "@/content/ui";
import { useContent, useSite } from "./SiteProvider";
import Magnetic from "./Magnetic";
import ThemeSwitcher from "./ThemeSwitcher";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./Header.module.css";

export default function Header() {
  const { scrollToSection } = useSite();
  const { guide } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<SectionId>("home");
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const labels = ui.nav;

  // Condense the header once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link for the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Drawer: Escape closes, Tab is trapped inside, focus returns to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>("a, button")?.focus();
    document.documentElement.style.overflow = "hidden";
    document.documentElement.setAttribute("data-menu-open", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab" && drawer) {
        const items = drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
      toggle?.focus();
    };
  }, [menuOpen]);

  const overHero = !scrolled && !menuOpen;

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined} data-over-hero={overHero || undefined}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.brand} aria-label={`${guide.name}, ${ui.nav.home}`}>
          <span className={styles.monogram} aria-hidden>
            {initials(guide.name)}
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{guide.name}</span>
            <span className={styles.brandRole}>{guide.tagline}</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul>
            {sectionIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? "location" : undefined} className={styles.link}>
                  {labels[id]}
                  {active === id && <motion.span layoutId="nav-underline" className={styles.underline} />}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Magnetic>
            <WhatsAppButton className={`btn btn--primary btn--sm ${styles.bookBtn}`}>{ui.nav.book}</WhatsAppButton>
          </Magnetic>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? ui.a11y.closeMenu : ui.a11y.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>

      {/* sync: the scrim and drawer intentionally animate together */}
      <AnimatePresence mode="sync">
        {menuOpen && (
          <>
            <motion.div
              className={styles.scrim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              id="mobile-menu"
              ref={drawerRef}
              className={styles.drawer}
              role="dialog"
              aria-modal="true"
              aria-label={ui.a11y.openMenu}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <nav aria-label="Mobile">
                <motion.ul
                  className={styles.drawerLinks}
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
                >
                  {sectionIds.map((id) => (
                    <motion.li key={id} variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}>
                      <a
                        href={`#${id}`}
                        aria-current={active === id ? "location" : undefined}
                        onClick={(e) => {
                          // Smooth scrolling is paused while the drawer is open:
                          // close it first, then glide to the section.
                          e.preventDefault();
                          setMenuOpen(false);
                          window.setTimeout(() => scrollToSection(id), 120);
                        }}
                      >
                        {labels[id]}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
              <div className={styles.drawerFooter}>
                <WhatsAppButton className="btn btn--primary btn--block" onClick={() => setMenuOpen(false)}>
                  {ui.nav.book}
                </WhatsAppButton>
                <a className="btn btn--outline btn--block" href={`tel:${guide.contact.phoneE164}`}>
                  <IconPhone size={18} /> {ui.contact.call} {guide.contact.phone}
                </a>
                <div className={styles.drawerSettings}>
                  <ThemeSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
