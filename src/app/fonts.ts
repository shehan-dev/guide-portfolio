import { Fraunces, Inter } from "next/font/google";

/* Shared by every root layout (each guide's site and the landing page). */
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["SOFT", "opsz"] });

export const fontVariables = `${inter.variable} ${fraunces.variable}`;
