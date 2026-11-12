/*
 * Content shapes used by every component. Sanity documents are mapped into
 * these in `src/sanity/content.ts`; `src/content/guide.ts` provides the same
 * shape as a bundled fallback.
 */

export type ThemeName = "guide-sky" | "italia" | "ceylon-night";

export type Proficiency = "native" | "fluent" | "conversational";

export interface LanguageSkill {
  name: string;
  code: string; // ISO 639-1, used for the badge
  proficiency: Proficiency;
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  reference?: string; // licence / membership number
  year?: number;
  kind: "license" | "language" | "safety" | "membership" | "insurance";
  file?: string; // URL to a PDF
}

export interface ExperienceEntry {
  years: string; // e.g. "2014 – today"
  role: string;
  place: string;
}

export interface GuideProfile {
  id: string;
  name: string;
  slug: string;
  title: string;
  /** Short line used above the hero name and under the logo, e.g. "Licensed tour guide · Sri Lanka". */
  tagline: string;
  /** Footer microcopy, e.g. "Available for private & group tours across Sri Lanka". */
  availability: string;
  shortPitch: string;
  pithyLine: string;
  heroImage: string;
  heroImageAlt: string;
  /** Leave empty to show the styled monogram placeholder. */
  portrait?: string;
  location: string;
  bio: string[]; // paragraphs
  highlights: string[]; // "why choose me" bullets
  yearsExperience: number;
  toursLed: number;
  languages: LanguageSkill[];
  experience: ExperienceEntry[]; // shown on the CV page
  licenseNumber: string;
  theme: ThemeName;
  contact: {
    phone: string; // display format
    phoneE164: string; // tel: link
    whatsapp: string; // digits only, for wa.me
    email: string;
    city: string;
    countryCode: string; // ISO 3166-1 alpha-2
    responseTime: string;
  };
  socials: { instagram?: string; facebook?: string; tripadvisor?: string; google?: string };
  seo?: { title?: string; description?: string };
}

export type ExpertiseId = "history" | "leisure" | "wildlife" | "photography";

export interface ExpertiseField {
  id: ExpertiseId;
  title: string;
  summary: string;
  description: string;
  activities: string[];
  images: string[]; // gallery image ids
}

export interface ItineraryStop {
  name: string;
  lat: number;
  lng: number;
}

export interface ItinerarySample {
  id: string;
  title: string;
  duration: string;
  highlights: string[];
  priceFrom: number; // USD
  priceTo?: number;
  description: string;
  tags: ExpertiseId[];
  stops: ItineraryStop[];
  image: string;
}

export interface Testimonial {
  id: string;
  author: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2, rendered as a flag
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  tour: string;
  date: string; // ISO date
  photo?: string;
  video?: string;
}

export type GalleryCategory = "culture" | "nature" | "food" | "portraits" | "vehicles";

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: GalleryCategory;
  location: string;
  dateTaken: string; // ISO date
  aspect: "portrait" | "landscape" | "square";
  credit: string; // photographer credit (Unsplash)
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Everything the site renders, from Sanity or the bundled fallback. */
export interface SiteContent {
  guide: GuideProfile;
  credentials: Credential[];
  gallery: GalleryImage[];
  expertise: ExpertiseField[];
  itineraries: ItinerarySample[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}
