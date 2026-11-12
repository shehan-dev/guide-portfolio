"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { motionTokens, usePointerEffects } from "@/lib/motion";

/**
 * Pulls its child a few pixels toward the cursor, to give the main calls to
 * action a tactile feel. Transform-only; inert on touch, reduced motion and
 * low-end devices.
 */
export default function Magnetic({
  children,
  strength = 0.25,
  max = 8,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const enabled = usePointerEffects();
  const x = useSpring(useMotionValue(0), motionTokens.spring);
  const y = useSpring(useMotionValue(0), motionTokens.spring);

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className={className} style={{ display: "inline-flex", x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
