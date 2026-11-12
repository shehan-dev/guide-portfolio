"use client";

import Link from "next/link";
import { ui } from "@/content/ui";
import { initials, sectionIds } from "@/lib/site";
import { IconFacebook, IconGoogle, IconInstagram, IconMail, IconPhone, IconTripAdvisor, IconWhatsApp } from "./Icons";
import { useContent, useSite } from "./SiteProvider";
import ThemeSwitcher from "./ThemeSwitcher";
import WhatsAppButton from "./WhatsAppButton";
import styles from "./Footer.module.css";

export default function Footer() {
  const { guide } = useContent();
  const { guideSlug } = useSite();
  const { contact, socials } = guide;
  const year = new Date().getFullYear();
  const navLabels = ui.nav;

  const socialLinks = [
    { href: socials.instagram, label: "Instagram", icon: <IconInstagram /> },
    { href: socials.facebook, label: "Facebook", icon: <IconFacebook /> },
    { href: socials.tripadvisor, label: "TripAdvisor", icon: <IconTripAdvisor /> },
    { href: socials.google, label: "Google", icon: <IconGoogle /> },
  ].filter((s) => s.href);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <span className={styles.monogram} aria-hidden>
            {initials(guide.name)}
          </span>
          <div>
            <p className={styles.name}>{guide.name}</p>
            <p className={styles.tagline}>{guide.availability}</p>
          </div>
        </div>
        <WhatsAppButton className="btn btn--primary">{ui.nav.book}</WhatsAppButton>
      </div>

      <div className={`container ${styles.cols}`}>
        <nav aria-label={ui.footer.quickLinks}>
          <h2 className={styles.colTitle}>{ui.footer.quickLinks}</h2>
          <ul className={styles.links}>
            {sectionIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{navLabels[id]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.colTitle}>{ui.nav.contact}</h2>
          <ul className={styles.links}>
            <li>
              <a href={`tel:${contact.phoneE164}`}>
                <IconPhone size={16} /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>
                <IconMail size={16} /> {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={styles.colTitle}>{ui.footer.follow}</h2>
          <ul className={styles.socials}>
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.settings}>
          <h2 className={styles.colTitle}>{ui.a11y.theme}</h2>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {guide.name}. {ui.footer.rights} <span className={styles.dot}>·</span> {ui.footer.photoCredit}
        </p>
        <ul className={styles.legal}>
          <li>
            <Link href={`/${guideSlug}/legal/terms`}>{ui.footer.legal.terms}</Link>
          </li>
          <li>
            <Link href={`/${guideSlug}/legal/privacy`}>{ui.footer.legal.privacy}</Link>
          </li>
          <li>
            <Link href={`/${guideSlug}/legal/accessibility`}>{ui.footer.legal.accessibility}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
