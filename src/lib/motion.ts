"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/*
 * Motion system (see .claude/skills/motion-ui): one set of tokens for every
 * animation. Motion must guide attention, communicate state or preserve
 * spatial continuity; only transform and opacity are animated.
 */

/** Low-end device: deviceMemory <= 2 GB, or (no memory API and <= 4 CPU cores). */
function detectLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === "number") return memory <= 2;
  return (navigator.hardwareConcurrency ?? 8) <= 4;
}

/** Evaluated once on the client; durations only affect animations, never markup. */
export const isLowEndDevice = detectLowEnd();
const scale = isLowEndDevice ? 0.6 : 1;

export const motionTokens = {
  duration: { fast: 0.18 * scale, normal: 0.35 * scale, slow: 0.6 * scale },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as const,
    sharp: [0.4, 0, 0.2, 1] as const,
  },
  distance: { sm: 8, md: 16, lg: 24 },
  /** Spring for pointer-driven motion (magnetic, tilt, parallax): quick, no wobble. */
  spring: { stiffness: 260, damping: 26, mass: 0.6 },
} as const;

/**
 * True when pointer-driven effects should run: a precise hovering pointer
 * (mouse / trackpad), no reduced-motion preference, and not a low-end device.
 * False during SSR and the first client render, so markup always matches.
 */
export function usePointerEffects(): boolean {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine && !reduce && !isLowEndDevice;
}
