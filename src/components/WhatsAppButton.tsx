"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ui } from "@/content/ui";
import { whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./Icons";
import { useContent } from "./SiteProvider";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** Prefilled message; `{name}` becomes the guide's first name. Defaults to a general enquiry. */
  message?: string;
  icon?: boolean;
  children: ReactNode;
};

/** Booking CTA: opens a WhatsApp chat with the guide (number from the CMS). */
export default function WhatsAppButton({ message = ui.contact.whatsappMessage, icon = true, children, ...rest }: Props) {
  const { guide } = useContent();
  return (
    <a href={whatsappLink(guide.contact.whatsapp, message, guide.name)} target="_blank" rel="noopener noreferrer" {...rest}>
      {icon && <IconWhatsApp size={18} />}
      {children}
      <span className="visually-hidden"> (WhatsApp, opens in a new tab)</span>
    </a>
  );
}
