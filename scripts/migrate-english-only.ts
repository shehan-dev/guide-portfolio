/*
 * One-off migration from the earlier bilingual schema to English-only.
 *
 * Every `{ en, it }` object (localeString / localeText) becomes its English
 * string, including inside arrays and nested objects, in both published
 * documents and drafts. Edits made in the Studio are preserved; only the
 * Italian text is dropped.
 *
 *   npm run migrate:english:dry   # preview, changes nothing
 *   npm run migrate:english       # apply
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

const dryRun = process.env.npm_lifecycle_event !== "migrate:english";
// "raw" perspective returns drafts (drafts.*) as well as published documents.
const client = getCliClient({ apiVersion: "2025-10-01", projectId, dataset, perspective: "raw" });

const TYPES = ["guideProfile", "expertise", "service", "addOn", "itinerary", "testimonial", "galleryImage", "credential", "faq"];
const SYSTEM_FIELDS = new Set(["_rev", "_createdAt", "_updatedAt"]);

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** A former localized value: `{ en, it }`, optionally with `_type` / `_key`. */
function isLocalized(v: Json): v is { [key: string]: Json } {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  if (v._type === "localeString" || v._type === "localeText") return true;
  const keys = Object.keys(v).filter((k) => k !== "_type" && k !== "_key");
  return keys.length > 0 && keys.every((k) => k === "en" || k === "it") && keys.includes("en");
}

let converted = 0;
function toEnglish(v: Json): Json {
  if (isLocalized(v)) {
    converted++;
    return typeof v.en === "string" ? v.en : "";
  }
  if (Array.isArray(v)) return v.map(toEnglish);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, toEnglish(val as Json)]));
  }
  return v;
}

async function main() {
  console.log(`${dryRun ? "[dry run] " : ""}Migrating ${projectId}/${dataset} to English-only …`);
  const docs = await client.fetch<{ [key: string]: Json }[]>(`*[_type in $types]`, { types: TYPES });

  const tx = client.transaction();
  let changedDocs = 0;
  for (const doc of docs) {
    const before = converted;
    const next = toEnglish(doc) as { [key: string]: Json };
    const fields = converted - before;
    if (fields === 0) continue;
    for (const k of SYSTEM_FIELDS) delete next[k];
    changedDocs++;
    console.log(`  ${String(doc._id).padEnd(40)} ${fields} field(s)`);
    tx.createOrReplace(next as { _id: string; _type: string });
  }

  if (changedDocs === 0) {
    console.log("✓ Nothing to migrate — the dataset is already English-only.");
    return;
  }
  if (dryRun) {
    console.log(`[dry run] Would update ${changedDocs} document(s), ${converted} field(s). Run \`npm run migrate:english\` to apply.`);
    return;
  }
  await tx.commit();
  console.log(`✓ Updated ${changedDocs} document(s), ${converted} field(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
