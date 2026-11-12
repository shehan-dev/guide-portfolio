"use client";

import { motion } from "motion/react";
import type { ItineraryStop } from "@/content/types";
import styles from "./IslandMap.module.css";

/*
 * Stylised Sri Lanka outline. Coastline points are (lat, lng) pairs,
 * projected linearly into a 100×170 viewBox — accurate enough to place
 * itinerary pins in the right region at thumbnail size.
 */
const BOUNDS = { north: 10.0, west: 79.5, scale: 40 };

const project = (lat: number, lng: number) => ({
  x: (lng - BOUNDS.west) * BOUNDS.scale,
  y: (BOUNDS.north - lat) * BOUNDS.scale,
});

const COAST: [number, number][] = [
  [9.82, 80.25], [9.55, 80.55], [9.27, 80.81], [8.57, 81.23], [8.0, 81.5], [7.72, 81.7],
  [7.2, 81.85], [6.84, 81.84], [6.4, 81.6], [6.12, 81.12], [5.92, 80.6], [6.03, 80.22],
  [6.4, 79.98], [6.93, 79.84], [7.2, 79.83], [8.0, 79.82], [8.6, 79.92], [8.98, 79.9],
  [9.3, 80.1], [9.65, 80.0], [9.8, 80.1],
];

/** Smooth closed path through points using midpoint quadratic curves. */
function smoothPath(points: { x: number; y: number }[]) {
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const n = points.length;
  const start = mid(points[n - 1], points[0]);
  let d = `M${start.x.toFixed(1)},${start.y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const m = mid(p, points[(i + 1) % n]);
    d += ` Q${p.x.toFixed(1)},${p.y.toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
  }
  return `${d} Z`;
}

const ISLAND_PATH = smoothPath(COAST.map(([lat, lng]) => project(lat, lng)));

export default function IslandMap({ stops, label, className }: { stops: ItineraryStop[]; label: string; className?: string }) {
  const pts = stops.map((s) => ({ ...project(s.lat, s.lng), name: s.name }));
  const route = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox="-4 -4 108 178" className={`${styles.map} ${className ?? ""}`} role="img" aria-label={label}>
      <path d={ISLAND_PATH} className={styles.island} />
      {pts.length > 1 && (
        <motion.path
          d={route}
          className={styles.route}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
        />
      )}
      {pts.map((p, i) => (
        <motion.g
          key={p.name}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.25 + i * 0.12 }}
        >
          <circle cx={p.x} cy={p.y} r={11} className={styles.pulse} style={{ animationDelay: `${i * 0.3}s` }} />
          <circle cx={p.x} cy={p.y} r={6} className={styles.pin} />
        </motion.g>
      ))}
    </svg>
  );
}
