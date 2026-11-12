import { defineField } from "sanity";

/** Shared "order" field so editors control the display order of list documents. */
export const orderField = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 100,
});
