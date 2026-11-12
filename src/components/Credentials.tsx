"use client";

import type { ReactNode } from "react";
import type { Credential } from "@/content/types";
import { IconAward, IconExternal, IconLanguage, IconShield, IconUsers } from "./Icons";
import { ui } from "@/content/ui";
import { RevealGroup, RevealItem } from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "./SiteProvider";
import styles from "./Credentials.module.css";

const icons: Record<Credential["kind"], ReactNode> = {
  license: <IconAward size={20} />,
  language: <IconLanguage size={20} />,
  safety: <IconShield size={20} />,
  membership: <IconUsers size={20} />,
  insurance: <IconShield size={20} />,
};

export default function Credentials() {
  const { credentials } = useContent();
  if (credentials.length === 0) return null; // nothing entered in the CMS → hide the section

  return (
    <section id="credentials" className="section section--compact" aria-labelledby="credentials-title">
      {/* Compact strip: title on the left, badges flowing in a row on the right. */}
      <div className={`container ${styles.strip}`}>
        <SectionHeading id="credentials-title" kicker={ui.credentials.kicker} title={ui.credentials.title} className={styles.head} />

        <RevealGroup className={styles.grid} stagger={0.07}>
          {credentials.map((c) => {
            const body = (
              <>
                <span className={styles.icon} aria-hidden>
                  {icons[c.kind]}
                </span>
                <span className={styles.kind}>{ui.credentials.kinds[c.kind]}</span>
                <strong className={styles.title}>{c.title}</strong>
                {(c.issuer || c.year) && (
                  <span className={styles.issuer}>{[c.issuer, c.year].filter(Boolean).join(" · ")}</span>
                )}
                {c.reference && <code className={styles.ref}>{c.reference}</code>}
                {c.file && (
                  <span className={styles.view}>
                    {ui.credentials.view} <IconExternal size={14} />
                  </span>
                )}
              </>
            );
            return (
              <RevealItem key={c.id}>
                {c.file ? (
                  <a className={styles.badge} href={c.file} target="_blank" rel="noopener noreferrer">
                    {body}
                    <span className="visually-hidden"> (PDF, opens in a new tab)</span>
                  </a>
                ) : (
                  <div className={styles.badge}>{body}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
