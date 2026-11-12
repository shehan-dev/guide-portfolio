"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { motionTokens } from "@/lib/motion";

/** Shared entrance pattern: fade + rise (distance token) + scale(0.99). */
export const revealVariants = {
  hidden: { opacity: 0, y: motionTokens.distance.md, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth } },
};

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; as?: "div" | "li" | "article" };

export default function Reveal({ delay = 0, as = "div", children, ...rest }: RevealProps) {
  const Comp = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={revealVariants}
      transition={{ delay }}
      {...(rest as object)}
    >
      {children}
    </Comp>
  );
}

/** Container that staggers its <RevealItem> children into view. */
export function RevealGroup({ stagger = 0.08, children, ...rest }: HTMLMotionProps<"div"> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={revealVariants} {...rest}>
      {children}
    </motion.div>
  );
}
