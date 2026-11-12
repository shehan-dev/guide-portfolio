"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { HTMLAttributes, PointerEvent, ReactNode } from "react";
import { motionTokens, usePointerEffects } from "@/lib/motion";

type TiltProps = Omit<HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> & {
  children: ReactNode;
  /** Maximum rotation in degrees. */
  max?: number;
};

/**
 * Card that tilts slightly toward the cursor and lifts on hover, signalling
 * it can be opened. Transform-only; inert on touch, reduced motion and
 * low-end devices (where it is a plain card).
 */
export default function Tilt({ children, max = 5, style, ...rest }: TiltProps) {
  const enabled = usePointerEffects();
  const rotateX = useSpring(useMotionValue(0), motionTokens.spring);
  const rotateY = useSpring(useMotionValue(0), motionTokens.spring);
  const lift = useSpring(useMotionValue(0), motionTokens.spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(-py * max * 2);
    lift.set(-6);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
  };

  return (
    <motion.div
      {...rest}
      style={{ ...style, rotateX, rotateY, y: lift, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
