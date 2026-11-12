"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { IconClose } from "./Icons";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name; rendered as the visible heading unless `hideTitle`. */
  title: string;
  hideTitle?: boolean;
  closeLabel: string;
  size?: "sm" | "md" | "lg" | "full";
  variant?: "default" | "dark";
  children: ReactNode;
}

const EXIT_MS = 220;

/**
 * Accessible modal built on the native <dialog>: focus trapping, Escape to
 * close and an inert background come from the browser. We add the
 * scale + opacity entrance/exit animation and backdrop-click closing.
 */
export default function Modal({ open, onClose, title, hideTitle, closeLabel, size = "md", variant = "default", children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setClosing(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      setClosing(true);
      const timer = window.setTimeout(() => {
        dialog.close();
        setClosing(false);
      }, EXIT_MS);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${styles[size]} ${variant === "dark" ? styles.dark : ""}`}
      data-closing={closing || undefined}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clicks on the ::backdrop land on the <dialog> element itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={titleId} className={hideTitle ? "visually-hidden" : styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
            <IconClose size={22} />
          </button>
        </header>
        {open || closing ? children : null}
      </div>
    </dialog>
  );
}
