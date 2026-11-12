/*
 * Interface copy (labels, headings, buttons). Guide-specific text lives in
 * the CMS (Sanity) — this file only holds wording shared by every guide.
 */
export const ui = {
  a11y: {
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    close: "Close",
    previous: "Previous",
    next: "Next",
    theme: "Colour theme",
    scrollDown: "Scroll to About",
    rating: "Rated {n} out of 5",
  },
  nav: {
    home: "Home",
    about: "About",
    expertise: "Expertise",
    itineraries: "Itineraries",
    testimonials: "Testimonials",
    gallery: "Gallery",
    contact: "Contact",
    book: "Book Now",
  },
  hero: {
    book: "Book a Tour",
    scroll: "Scroll",
  },
  about: {
    kicker: "About me",
    title: "Your friend on the island",
    years: "years guiding",
    tours: "private tours",
    languages: "languages",
    why: "Why travel with me",
    license: "Licence no.",
    cta: "Request a Private Tour",
    portraitPlaceholder: "Portrait coming soon",
  },
  expertise: {
    kicker: "My expertise",
    title: "What I love to show you",
    intro: "The kinds of days I plan most often. Most tours mix two or three of them.",
    languagesTitle: "Languages I guide in",
    proficiency: { native: "Native", fluent: "Fluent", conversational: "Conversational" },
    learnMore: "Learn more",
    sampleActivities: "Sample activities",
    seeItineraries: "See matching itineraries",
  },
  itineraries: {
    kicker: "Itinerary samples",
    title: "Ideas to start from",
    intro: "Every tour is private and tailored to you. Pick a starting point and I'll customise it on WhatsApp.",
    all: "All",
    duration: "Duration",
    price: "Price",
    from: "from",
    book: "Book now",
    drag: "Drag",
    whatsappMessage: 'Hi {name}! I\'d like to request a custom tour based on the "{itinerary}" itinerary ({duration}).',
    none: "No itineraries match this filter yet.",
    mapLabel: "Map of stops: {stops}",
  },
  testimonials: {
    kicker: "Client feedback",
    title: "What travellers say",
  },
  gallery: {
    kicker: "Gallery",
    title: "Moments from the road",
    all: "All",
    categories: { culture: "Culture", nature: "Nature", food: "Food", portraits: "Portraits", vehicles: "Vehicles" },
    imageOf: "Image {i} of {n}",
    photo: "Photo",
  },
  credentials: {
    kicker: "Credentials",
    title: "Licensed, certified, insured",
    view: "View document",
    kinds: { license: "Licence", language: "Language", safety: "Safety", membership: "Membership", insurance: "Insurance" },
  },
  faq: {
    kicker: "FAQ",
    title: "Good to know before you go",
  },
  contact: {
    kicker: "Contact & booking",
    title: "Let's plan your trip",
    intro: "Message me on WhatsApp with your dates, group size and interests, and I'll reply personally with a tailored proposal.",
    cta: "Book on WhatsApp",
    whatsapp: "WhatsApp",
    call: "Call",
    email: "Email",
    meeting: "Meeting point",
    whatsappMessage: "Hi {name}! I'd like information about a private tour.",
  },
  floating: {
    book: "Book now",
    open: "Contact me",
  },
  footer: {
    quickLinks: "Quick links",
    follow: "Follow",
    legal: { terms: "Terms & Conditions", privacy: "Privacy", accessibility: "Accessibility" },
    rights: "All rights reserved.",
    photoCredit: "Photos: Unsplash",
    themes: { "guide-sky": "Sky", italia: "Italia", "ceylon-night": "Night" },
  },
  cv: {
    title: "Curriculum Vitae",
    print: "Print / Save as PDF",
    back: "Back to site",
    profile: "Profile",
    experience: "Experience",
    languages: "Languages",
    credentials: "Credentials",
    specialties: "Specialties",
    contact: "Contact",
  },
  landing: {
    /* Root domain: a "coming soon" page that sends visitors to a guide's own link. */
    title: "Tour guide portfolios",
    badge: "In the making",
    heading: "Portfolios for Sri Lanka's tour guides", // non-breaking space keeps "Sri Lanka" on one line
    intro: "We're building a home where licensed guides share their tours, stories and reviews. The main site is on its way.",
    finderTitle: "Looking for a guide? Go straight to their portfolio.",
    finderLabel: "Guide's name",
    placeholder: "guide-name",
    open: "Open portfolio",
    hint: "Each guide has their own link, for example {host}/guide-name.",
    notFound: "We couldn't find a guide at that address. Check the link you were given.",
    empty: "Please type the guide's name.",
    photo: "Photo: Unsplash",
  },
  legal: {
    back: "Back to home",
    placeholder: "This page is a placeholder. Replace it with the guide's legal text before publishing.",
  },
};

/** Replace `{key}` tokens in a UI string. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`));
}
