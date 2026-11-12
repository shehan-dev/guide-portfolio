import { credential, expertise, faq, galleryImage, itinerary, testimonial } from "./collections";
import { guideProfile } from "./guideProfile";

export const schemaTypes = [guideProfile, expertise, itinerary, testimonial, galleryImage, credential, faq];

/** Document types with exactly one document (fixed id = type name). */
export const singletonTypes = new Set(["guideProfile"]);
