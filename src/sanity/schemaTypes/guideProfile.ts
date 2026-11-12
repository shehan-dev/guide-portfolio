import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton (document id "guideProfile"): one guide per dataset. */
export const guideProfile = defineType({
  name: "guideProfile",
  title: "Guide profile",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "about", title: "About & CV" },
    { name: "contact", title: "Contact" },
    { name: "settings", title: "Look & SEO" },
  ],
  fields: [
    // Profile
    defineField({ name: "name", type: "string", group: "profile", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "profile",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Professional title", type: "string", group: "profile", validation: (r) => r.required() }),
    defineField({
      name: "tagline",
      type: "string",
      group: "profile",
      description: 'Short line above the hero name, e.g. "Licensed tour guide · Sri Lanka".',
      validation: (r) => r.required(),
    }),
    defineField({ name: "pithyLine", title: "Hero one-liner", type: "string", group: "profile", validation: (r) => r.required() }),
    defineField({ name: "shortPitch", title: "Short pitch", type: "text", rows: 3, group: "profile", validation: (r) => r.required() }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      description: "Full-screen first view. Use a high-resolution landscape photo (at least 2400px wide).",
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroImageAlt", title: "Hero image description (alt text)", type: "string", group: "profile", validation: (r) => r.required() }),

    // About & CV
    defineField({
      name: "portrait",
      type: "image",
      group: "about",
      options: { hotspot: true },
      description: "Leave empty to show a styled monogram placeholder.",
    }),
    defineField({ name: "location", type: "string", group: "about", validation: (r) => r.required() }),
    defineField({
      name: "bio",
      title: "Bio paragraphs",
      type: "array",
      group: "about",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "highlights",
      title: '"Why travel with me" bullets',
      type: "array",
      group: "about",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "yearsExperience", type: "number", group: "about", validation: (r) => r.required().min(0) }),
    defineField({ name: "toursLed", title: "Tours led", type: "number", group: "about", validation: (r) => r.required().min(0) }),
    defineField({ name: "licenseNumber", type: "string", group: "about" }),
    defineField({
      name: "languages",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "languageSkill",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "code", title: "ISO code", type: "string", description: "e.g. it, en", validation: (r) => r.required().max(3) }),
            defineField({
              name: "proficiency",
              type: "string",
              options: { list: ["native", "fluent", "conversational"], layout: "radio", direction: "horizontal" },
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "proficiency" } },
        }),
      ],
    }),
    defineField({
      name: "experience",
      title: "Experience (CV page)",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "experienceEntry",
          fields: [
            defineField({ name: "years", type: "string", description: 'e.g. "2014 – today"', validation: (r) => r.required() }),
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
            defineField({ name: "place", type: "string" }),
          ],
          preview: { select: { title: "role", subtitle: "years" } },
        }),
      ],
    }),

    // Contact
    defineField({
      name: "contact",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "phone", title: "Phone (display)", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "phoneE164",
          title: "Phone (international, for tap-to-call)",
          type: "string",
          description: "e.g. +94771234567",
          validation: (r) => r.required().regex(/^\+\d{6,15}$/, { name: "E.164 number" }),
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp number (digits only)",
          type: "string",
          description: "Country code + number, no + or spaces, e.g. 94771234567",
          validation: (r) => r.required().regex(/^\d{6,15}$/, { name: "digits" }),
        }),
        defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
        defineField({ name: "city", type: "string", validation: (r) => r.required() }),
        defineField({ name: "countryCode", title: "Country code (ISO)", type: "string", initialValue: "LK", validation: (r) => r.required().length(2) }),
        defineField({ name: "responseTime", type: "string", description: 'e.g. "Usually replies within 12 hours"' }),
      ],
    }),
    defineField({
      name: "socials",
      type: "object",
      group: "contact",
      fields: ["instagram", "facebook", "tripadvisor", "google"].map((name) =>
        defineField({ name, type: "url", title: name === "google" ? "Google reviews / Maps" : undefined }),
      ),
    }),

    // Look & SEO
    defineField({
      name: "theme",
      type: "string",
      group: "settings",
      initialValue: "guide-sky",
      options: {
        list: [
          { title: "Sky (blue & teal)", value: "guide-sky" },
          { title: "Italia (terracotta & olive)", value: "italia" },
          { title: "Ceylon night (dark)", value: "ceylon-night" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "availability", title: "Footer microcopy", type: "string", group: "settings" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "settings",
      fields: [
        defineField({ name: "title", title: "Page title", type: "string" }),
        defineField({ name: "description", title: "Meta description", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "title", media: "portrait" } },
});
