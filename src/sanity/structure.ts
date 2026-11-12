import type { StructureResolver } from "sanity/structure";

const lists: { type: string; title: string; orderBy?: "order" | "date" }[] = [
  { type: "expertise", title: "Expertise" },
  { type: "itinerary", title: "Itineraries" },
  { type: "testimonial", title: "Testimonials", orderBy: "date" },
  { type: "galleryImage", title: "Gallery" },
  { type: "credential", title: "Credentials" },
  { type: "faq", title: "FAQ" },
];

/** Desk layout: the guide profile as a single editable document, then one list per section. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website")
    .items([
      S.listItem()
        .title("Guide profile")
        .id("guideProfile")
        .child(S.document().schemaType("guideProfile").documentId("guideProfile").title("Guide profile")),
      S.divider(),
      ...lists.map(({ type, title, orderBy = "order" }) =>
        S.listItem()
          .title(title)
          .schemaType(type)
          .child(
            S.documentTypeList(type)
              .title(title)
              .defaultOrdering(orderBy === "date" ? [{ field: "date", direction: "desc" }] : [{ field: "order", direction: "asc" }]),
          ),
      ),
    ]);
