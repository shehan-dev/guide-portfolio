"use client";

import { IconDownload } from "./Icons";

export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn--primary btn--sm" onClick={() => window.print()}>
      <IconDownload size={16} /> {label}
    </button>
  );
}
