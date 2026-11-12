import { defineArrayMember, defineField, defineType } from "sanity";
import { orderField } from "./fields";

const expertiseOptions = [
  { title: "Ancient History", value: "history" },
  { title: "Leisure & Food", value: "leisure" },
  { title: "Wildlife & Nature", value: "wildlife" },
  { title: "Photography", value: "photography" },
];

const stringList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });

export const expertise = defineType({
  name: "expertise",
  title: "Expertise field",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Category",
      type: "string",
      description: "Links this field to the itinerary filter.",
      options: { list: expertiseOptions },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    stringList("activities", "Sample activities"),
    defineField({
      name: "images",
      type: "array",
      description: "The first image is the card cover; up to 3 appear in the detail pop-up.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "galleryImage" }] })],
      validation: (r) => r.min(1).max(3),
    }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "key" } },
});

export const itinerary = defineType({
  name: "itinerary",
  title: "Itinerary sample",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "duration", type: "string", description: 'e.g. "1 day · 10h"', validation: (r) => r.required() }),
    stringList("highlights", "Highlights"),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "priceFrom", title: "Price from (USD)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "priceTo", title: "Price to (USD)", type: "number" }),
    defineField({
      name: "tags",
      title: "Expertise categories",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: expertiseOptions, layout: "grid" },
    }),
    defineField({
      name: "stops",
      title: "Map stops",
      type: "array",
      description: "Shown as pins on the mini island map, in route order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "stop",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "lat", title: "Latitude", type: "number", validation: (r) => r.required() }),
            defineField({ name: "lng", title: "Longitude", type: "number", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", lat: "lat", lng: "lng" }, prepare: ({ title, lat, lng }) => ({ title, subtitle: `${lat}, ${lng}` }) },
        }),
      ],
    }),
    defineField({ name: "image", title: "Cover image", type: "reference", to: [{ type: "galleryImage" }], validation: (r) => r.required() }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "duration", media: "image.image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "country", type: "string" }),
    defineField({ name: "countryCode", title: "Country code (ISO)", type: "string", description: "e.g. IT, CH, FR", validation: (r) => r.length(2) }),
    defineField({ name: "rating", type: "number", initialValue: 5, validation: (r) => r.required().integer().min(1).max(5) }),
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "tour", type: "string" }),
    defineField({ name: "date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "video", title: "Video testimonial", type: "file", options: { accept: "video/*" } }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "author", subtitle: "tour", media: "photo" } },
});

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "title", type: "string", description: "Also used as the alt text.", validation: (r) => r.required() }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["culture", "nature", "food", "portraits", "vehicles"], layout: "radio", direction: "horizontal" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "dateTaken", type: "date" }),
    defineField({
      name: "aspect",
      title: "Crop shape in the grid",
      type: "string",
      initialValue: "landscape",
      options: { list: ["landscape", "portrait", "square"], layout: "radio", direction: "horizontal" },
    }),
    defineField({ name: "credit", title: "Photo credit", type: "string" }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "location", media: "image" } },
});

export const credential = defineType({
  name: "credential",
  title: "Credential",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "issuer", type: "string" }),
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["license", "language", "safety", "membership", "insurance"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "reference", title: "Licence / membership number", type: "string" }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "file", title: "Document (PDF)", type: "file", options: { accept: "application/pdf" } }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "kind" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
    orderField,
  ],
  preview: { select: { title: "question" } },
});
