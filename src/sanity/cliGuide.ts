import { hasSanity, readGuides, type GuideConfig } from "./guides";

/*
 * Picks the guide a Sanity CLI command / script works on:
 *   $env:GUIDE="nishan-silva"; npm run seed      (PowerShell)
 *   GUIDE=nishan-silva npm run seed               (bash)
 * Without GUIDE, the registry's only Sanity-connected guide is used.
 */

/** The Sanity CLI doesn't read Next.js env files; load them the way Next.js does. */
export function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      /* file not present */
    }
  }
}

export function cliGuide(): { slug: string; config: GuideConfig } {
  loadEnvFiles();
  const all = readGuides();
  const connected = Object.keys(all).filter((slug) => hasSanity(all[slug]));
  const wanted = process.env.GUIDE?.trim();

  if (wanted) {
    if (!hasSanity(all[wanted])) {
      throw new Error(`GUIDE="${wanted}" is not a Sanity-connected guide in NEXT_PUBLIC_GUIDES. Available: ${connected.join(", ") || "(none)"}`);
    }
    return { slug: wanted, config: all[wanted] };
  }
  if (connected.length === 1) return { slug: connected[0], config: all[connected[0]] };
  if (connected.length === 0) throw new Error("No guides with a Sanity projectId in NEXT_PUBLIC_GUIDES (.env).");
  throw new Error(`Several guides are configured — choose one with GUIDE, e.g. $env:GUIDE="${connected[0]}". Available: ${connected.join(", ")}`);
}
