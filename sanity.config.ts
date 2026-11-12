"use client";

/*
 * Sanity Studio, embedded in the Next.js app. One workspace per guide in
 * NEXT_PUBLIC_GUIDES, each pointing at that guide's own Sanity project:
 *   /studio              → workspace picker
 *   /studio/<guide-slug> → that guide's content
 */
import { visionTool } from "@sanity/vision";
import { defineConfig, type WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion } from "./src/sanity/env";
import { guides, hasSanity } from "./src/sanity/guides";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

/** "nishan-silva" → "Nishan Silva" (workspace label in the picker). */
const label = (slug: string) => slug.replace(/(^|-)([a-z])/g, (_, dash: string, c: string) => (dash ? " " : "") + c.toUpperCase());

export const workspaces: WorkspaceOptions[] = Object.entries(guides)
  .filter(([, config]) => hasSanity(config))
  .map(([slug, { projectId, dataset }]) => ({
    name: slug,
    title: label(slug),
    basePath: `/studio/${slug}`,
    projectId,
    dataset,
    schema: {
      types: schemaTypes,
      // Hide singletons from "Create new document".
      templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
    },
    document: {
      // Singletons can't be duplicated or deleted.
      actions: (input, context) =>
        singletonTypes.has(context.schemaType) ? input.filter(({ action }) => action && singletonActions.has(action)) : input,
    },
    plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  }));

export default defineConfig(workspaces);
