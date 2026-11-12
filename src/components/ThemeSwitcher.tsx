"use client";

import { useEffect, useState } from "react";
import type { ThemeName } from "@/content/types";
import { themeStorageKey } from "@/lib/site";
import { ui } from "@/content/ui";
import { useSite } from "./SiteProvider";
import styles from "./ThemeSwitcher.module.css";

const themes: { id: ThemeName; swatch: [string, string, string] }[] = [
  { id: "guide-sky", swatch: ["#ffffff", "#0a5fe0", "#00a3c4"] },
  { id: "italia", swatch: ["#fbf7f0", "#a63f25", "#6b8740"] },
  { id: "ceylon-night", swatch: ["#0b1220", "#6aaaff", "#2dd4bf"] },
];

/** Swaps the CSS-variable preset on <html data-theme> and remembers the choice. */
export default function ThemeSwitcher() {
  const { guideSlug } = useSite();
  const [current, setCurrent] = useState<ThemeName | null>(null);

  useEffect(() => {
    setCurrent((document.documentElement.dataset.theme as ThemeName) ?? "guide-sky");
  }, []);

  const apply = (id: ThemeName) => {
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem(themeStorageKey(guideSlug), id);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    setCurrent(id);
  };

  return (
    <div className={styles.group} role="radiogroup" aria-label={ui.a11y.theme}>
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={current === t.id}
          className={styles.option}
          onClick={() => apply(t.id)}
        >
          <span className={styles.swatch} aria-hidden>
            {t.swatch.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </span>
          {ui.footer.themes[t.id]}
        </button>
      ))}
    </div>
  );
}
