import type { ReactNode } from "react";

export { metadata, viewport } from "next-sanity/studio";

/* The Studio has its own root layout, separate from the public site's (site) layout. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
