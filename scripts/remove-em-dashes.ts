/*
 * Removes em dashes (—) from a guide's Sanity content, in published documents
 * and drafts. Known seeded phrases get a hand-written rewrite; any other
 * " — " becomes ", ".
 *
 *   npm run content:dashes:dry   # preview, changes nothing
 *   npm run content:dashes       # apply
 * With several guides, choose one first: $env:GUIDE="nishan-silva" (PowerShell).
 *
 * The mode comes from the npm script name: `sanity exec` doesn't forward
 * extra CLI arguments to the script.
 */
import { getCliClient } from "sanity/cli";
import { cliGuide } from "../src/sanity/cliGuide";

let target: ReturnType<typeof cliGuide>;
try {
  target = cliGuide();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
const { projectId, dataset } = target.config;
const dryRun = process.env.npm_lifecycle_event !== "content:dashes";
const client = getCliClient({ apiVersion: "2025-10-01", projectId, dataset, perspective: "raw" });

const TYPES = ["guideProfile", "expertise", "itinerary", "testimonial", "galleryImage", "credential", "faq"];
const SYSTEM_FIELDS = new Set(["_rev", "_createdAt", "_updatedAt"]);

/** Rewrites for the seeded dummy text, matching the bundled fallback content. */
const REWRITES: [string, string][] = [
  ["Nishan Silva — Italian-speaking Tour Guide in Sri Lanka", "Nishan Silva | Italian-speaking Tour Guide in Sri Lanka"],
  ["Private tours of Sri Lanka in Italian — ancient cities,", "Private tours of Sri Lanka in Italian: ancient cities,"],
  ["Stories of the island, told in Italian — personal, local, unforgettable.", "Stories of the island, told in Italian by someone who grew up here."],
  ["Ciao — I'm Nishan,", "Ciao, I'm Nishan,"],
  ["living in Rome — so I guide in Italian", "living in Rome, so I guide in Italian"],
  ["Private tours only — your pace, your interests", "Private tours only, at your pace and around your interests"],
  ["CILS C1 — Italian as a foreign language", "CILS C1: Italian as a foreign language"],
  ["palace intrigue — told in clear Italian", "palace intrigue, told in clear Italian"],
  ["Nine Arches Bridge — with an overnight", "Nine Arches Bridge, with an overnight"],
  ["Hotels, trains, safari — he handled everything", "Hotels, trains, safari: he handled everything"],
  ["respects the animals — no chasing, no crowding.", "respects the animals: no chasing, no crowding."],
  ["(and socks — temple floors get hot!)", "(and socks, because temple floors get hot!)"],
];

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const changes: { id: string; path: string; before: string; after: string }[] = [];

function fixString(s: string): string {
  if (!s.includes("—")) return s;
  let out = s;
  for (const [a, b] of REWRITES) out = out.split(a).join(b);
  return out.replace(/\s*—\s*/g, ", ");
}

function walk(v: Json, id: string, path: string): Json {
  if (typeof v === "string") {
    const next = fixString(v);
    if (next !== v) changes.push({ id, path, before: v, after: next });
    return next;
  }
  if (Array.isArray(v)) return v.map((item, i) => walk(item, id, `${path}[${i}]`));
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v).map(([k, val]) => [k, k.startsWith("_") ? val : walk(val as Json, id, path ? `${path}.${k}` : k)]),
    );
  }
  return v;
}

async function main() {
  console.log(`${dryRun ? "[dry run] " : ""}Removing em dashes in "${target.slug}" (${projectId}/${dataset}) …`);
  const docs = await client.fetch<{ [key: string]: Json }[]>(`*[_type in $types]`, { types: TYPES });

  const tx = client.transaction();
  let changedDocs = 0;
  for (const doc of docs) {
    const before = changes.length;
    const next = walk(doc, String(doc._id), "") as { [key: string]: Json };
    if (changes.length === before) continue;
    for (const k of SYSTEM_FIELDS) delete next[k];
    changedDocs++;
    tx.createOrReplace(next as { _id: string; _type: string });
  }

  for (const c of changes) console.log(`  ${c.id} · ${c.path}\n    - ${c.before}\n    + ${c.after}`);
  if (changedDocs === 0) {
    console.log("✓ No em dashes found.");
    return;
  }
  if (dryRun) {
    console.log(`[dry run] Would update ${changes.length} field(s) in ${changedDocs} document(s). Run \`npm run content:dashes\` to apply.`);
    return;
  }
  await tx.commit();
  console.log(`✓ Updated ${changes.length} field(s) in ${changedDocs} document(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
