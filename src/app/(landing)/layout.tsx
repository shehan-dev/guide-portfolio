import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ui } from "@/content/ui";
import { siteUrl } from "@/lib/site";
import { fontVariables } from "../fonts";
import "../globals.css";

/* Root layout for the main domain's landing page (the guide directory). */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: ui.landing.title,
  description: ui.landing.intro,
  alternates: { canonical: "/" },
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="guide-sky" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
