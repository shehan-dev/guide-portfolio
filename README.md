# Guide Portfolio

Portfolio sites for individual tour guides, built with Next.js 16 (App Router) and Sanity CMS. One deployment serves every guide:

| URL | What |
| --- | --- |
| `domain.lk/` | Landing page that lists every guide |
| `domain.lk/<guide-slug>` | That guide's portfolio (plus `/<slug>/cv` and `/<slug>/legal/*`) |
| `domain.lk/studio/<guide-slug>` | That guide's Sanity Studio (`/studio` shows a workspace picker) |

Each guide has **their own Sanity project**. The registry in `NEXT_PUBLIC_GUIDES` maps each URL slug to its project. Dummy content for **Nishan Silva** is included.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
| --- | --- |
| Guide registry (slug → Sanity project, from `NEXT_PUBLIC_GUIDES`) | `src/sanity/guides.ts` |
| Loading one guide's content | `src/sanity/content.ts` → `getSiteContent(slug)` |
| Guide routes (root layout per guide) | `src/app/(guide)/[guide]/*` |
| Landing page (guide directory) | `src/app/(landing)/*` |
| Bundled fallback / seed content | `src/content/guide.ts` |
| Content types used by the components | `src/content/types.ts` |
| Interface copy (labels, headings, buttons, landing page) | `src/content/ui.ts` |
| Sanity schema, Studio desk layout, workspaces | `src/sanity/schemaTypes/*`, `src/sanity/structure.ts`, `sanity.config.ts` |
| Theme presets, design tokens, motion tokens | `src/app/globals.css` |
| Publish webhook → refresh one guide's pages | `src/app/api/revalidate/route.ts` |
| Page sections (one component per section) | `src/components/*` |

## Configuration

```bash
NEXT_PUBLIC_SITE_URL=https://domain.lk
NEXT_PUBLIC_GUIDES={"nishan-silva":{"projectId":"abc12345","dataset":"production"},"shehan-silva":{"projectId":"xyz67890","dataset":"production"}}
SANITY_REVALIDATE_SECRET_NISHAN_SILVA=long-random-string
SANITY_REVALIDATE_SECRET_SHEHAN_SILVA=another-long-random-string
```

- `NEXT_PUBLIC_GUIDES` is one line of JSON. The keys are URL slugs: lowercase letters, digits and hyphens, and not `studio` or `api`. The Studio runs in the browser, so this is a `NEXT_PUBLIC_` variable, which means **changing it requires a dev-server restart or a redeploy**.
- When `NEXT_PUBLIC_GUIDES` is empty, the site runs a single `demo` guide (`/demo`) with the bundled dummy content, so it works without any Sanity project.
- A guide whose dataset has no guide profile yet also shows the dummy content until it's seeded or filled in.

## Adding a guide

1. **Create a Sanity project** at [sanity.io/manage](https://www.sanity.io/manage) and keep the `production` dataset (visibility: Public). Don't run `sanity init` in this folder, because it overwrites `sanity.config.ts`.
2. **CORS:** in that project, go to API → CORS origins and add `http://localhost:3000` and `https://domain.lk`, both with **Allow credentials** ticked.
3. **Register it:** add `"<slug>":{"projectId":"…","dataset":"production"}` to `NEXT_PUBLIC_GUIDES`, then restart or redeploy.
4. **Seed the dummy content** (optional, new datasets only). Choose the guide with `GUIDE` when more than one is configured:
   ```powershell
   npm run sanity:login                            # once
   $env:GUIDE="shehan-silva"; npm run seed         # PowerShell
   GUIDE=shehan-silva npm run seed                 # bash
   ```
5. **Edit** at `/studio/<slug>`. The guide logs in with their own Sanity account; they need to be a member of their project.
6. **Webhook** (production): in that project, go to API → Webhooks and add:
   - URL `https://domain.lk/api/revalidate?guide=<slug>`
   - Trigger on create, update and delete
   - Secret: the same value as `SANITY_REVALIDATE_SECRET_<SLUG>` (e.g. `SANITY_REVALIDATE_SECRET_SHEHAN_SILVA`)

### When published changes show up

Only **published** changes reach the site.
- With `npm run dev`, they show on the next refresh.
- In production, the guide's webhook makes them show on the next page load.
- Without the webhook, they show within about a minute, when the page regenerates in the background.

Each guide's pages and their landing-page card share a cache tag (`guide:<slug>`), so a publish refreshes only that guide.

### Content model

- **Guide profile:** a single document holding name, hero, bio, languages, CV experience, contact details (the WhatsApp number receives all bookings), socials, theme and SEO.
- **List documents:** expertise, itineraries, testimonials, gallery images, credentials and FAQ. Lists use a "Display order" field, except testimonials, which sort newest first.
- Itinerary covers, expertise images and the contact meeting photo are references to gallery images.

### Migrating from the earlier bilingual schema

`npm run migrate:english:dry` previews the conversion and `npm run migrate:english` applies it. With several guides, set `GUIDE` first, as for the seed.

## Features

- Full-screen hero with parallax, letter-by-letter title reveal and a scroll cue
- Smooth inertia scrolling (Lenis). It pauses while a modal or the menu is open and respects `prefers-reduced-motion`.
- Bookings go through WhatsApp: every "Book" button opens a chat with the guide's number from the CMS. Itinerary cards prefill a custom-tour request for that itinerary.
- Optional sections hide themselves when the CMS has nothing for them (credentials, testimonials, the "why travel with me" box)
- SEO per guide: metadata, Open Graph, canonical `/<slug>`, JSON-LD (`Person`, `Service` with reviews, `TouristTrip`, `FAQPage`), plus a sitemap that lists every guide
- The visitor's colour theme is remembered separately for each guide
- Accessibility: skip link, native `<dialog>` modals, carousel and accordion ARIA patterns, keyboard navigation in the lightbox
- `/<slug>/cv` is a printable CV page. Nothing links to it, but it is still available.

## Before going live

- Replace the dummy content in each guide's Studio (phone, email, socials, photos, credential PDFs)
- Write the legal pages (`src/app/(guide)/[guide]/legal/[slug]/page.tsx` currently shows placeholder text)
- Set `NEXT_PUBLIC_SITE_URL`, and replace the dummy WhatsApp number in each Guide profile → Contact
- Edit the landing-page wording in `src/content/ui.ts` → `landing`
