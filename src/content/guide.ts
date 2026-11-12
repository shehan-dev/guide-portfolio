import type {
  Credential,
  ExpertiseField,
  FaqItem,
  GalleryImage,
  GuideProfile,
  ItinerarySample,
  SiteContent,
  Testimonial,
} from "./types";

/*
 * DUMMY CONTENT for Nishan Silva.
 * - Used as the fallback until Sanity is configured (see src/sanity/content.ts).
 * - Used by `npm run seed` to populate a fresh Sanity dataset.
 */

const u = (id: string, ar?: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy${ar ? `&ar=${ar}` : ""}`;

export const guide: GuideProfile = {
  id: "guide_profile",
  name: "Nishan Silva",
  slug: "nishan-silva",
  title: "Licensed Italian-speaking tour guide · Sri Lanka",
  tagline: "Licensed tour guide · Sri Lanka",
  availability: "Available for private & group tours across Sri Lanka",
  seo: {
    title: "Nishan Silva | Italian-speaking Tour Guide in Sri Lanka",
    description: "Private tours of Sri Lanka in Italian and English with licensed guide Nishan Silva: Sigiriya, Kandy, tea country, Yala safaris and bespoke itineraries.",
  },
  shortPitch: "Private tours of Sri Lanka in Italian: ancient cities, tea country, wildlife and the island's best kitchens.",
  pithyLine: "Stories of the island, told in Italian by someone who grew up here.",
  heroImage: u("1612862862126-865765df2ded"),
  heroImageAlt: "Aerial view of Sigiriya rock fortress rising above the green forest of Sri Lanka",
  portrait: undefined,
  location: "Based in Kandy, guiding island-wide",
  bio: [
    "Ciao, I'm Nishan, a government-licensed national tour guide specialised in ancient history and cultural journeys across Sri Lanka. I studied Italian at university in Kandy, then spent four years living in Rome, so I guide in Italian the way you'd chat with a friend over coffee.",
    "My tours are private and unhurried: temple visits timed to avoid the crowds, lunch in family kitchens, quiet tea-estate walks, and the stories behind the stones that guidebooks leave out.",
  ],
  highlights: [
    "SLTDA-licensed National Tourist Guide Lecturer",
    "Fluent Italian (CILS C1 certified)",
    "First-aid certified · fully insured",
    "Private tours only, at your pace and around your interests",
  ],
  yearsExperience: 12,
  toursLed: 900,
  languages: [
    { name: "Italian", code: "it", proficiency: "fluent" },
    { name: "English", code: "en", proficiency: "fluent" },
    { name: "Sinhala", code: "si", proficiency: "native" },
    { name: "Tamil", code: "ta", proficiency: "conversational" },
  ],
  experience: [
    {
      years: "2014 –",
      role: "Freelance National Tourist Guide",
      place: "Sri Lanka, island-wide",
    },
    {
      years: "2010 – 2014",
      role: "Hospitality & tour coordinator",
      place: "Rome, Italy",
    },
    {
      years: "2006 – 2010",
      role: "BA in Modern Languages (Italian)",
      place: "University of Peradeniya, Kandy",
    },
  ],
  licenseNumber: "NTG/2014/0457",
  theme: "guide-sky",
  contact: {
    phone: "+94 70 000 0000",
    phoneE164: "+94700000000",
    whatsapp: "94700000000",
    email: "nishan@example.com",
    city: "Kandy",
    countryCode: "LK",
    responseTime: "Usually replies within 12 hours",
  },
  socials: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tripadvisor: "https://www.tripadvisor.com/",
    google: "https://www.google.com/maps",
  },
};

export const credentials: Credential[] = [
  {
    id: "sltda",
    kind: "license",
    title: "National Tourist Guide Licence",
    issuer: "Sri Lanka Tourism Development Authority",
    reference: "NTG/2014/0457",
    year: 2014,
    file: "/docs/credential-placeholder.pdf",
  },
  {
    id: "cils",
    kind: "language",
    title: "CILS C1: Italian as a foreign language",
    issuer: "Università per Stranieri di Siena",
    year: 2016,
    file: "/docs/credential-placeholder.pdf",
  },
  {
    id: "first-aid",
    kind: "safety",
    title: "Wilderness First Aid",
    issuer: "Sri Lanka Red Cross Society",
    year: 2025,
    file: "/docs/credential-placeholder.pdf",
  },
  {
    id: "association",
    kind: "membership",
    title: "Member, Tourist Guide Lecturers' Association",
    issuer: "Sri Lanka",
    reference: "M-1182",
    file: "/docs/credential-placeholder.pdf",
  },
  {
    id: "insurance",
    kind: "insurance",
    title: "Public liability insurance",
    issuer: "Valid through 2027",
    file: "/docs/credential-placeholder.pdf",
  },
];

export const gallery: GalleryImage[] = [
  { id: "sigiriya", url: u("1612862862126-865765df2ded", "4:3"), aspect: "landscape", category: "culture", location: "Sigiriya", dateTaken: "2025-08-14", credit: "Unsplash", title: "Sigiriya, the Lion Rock" },
  { id: "tooth-temple", url: u("1665849050430-5e8c16bacf7e", "3:4"), aspect: "portrait", category: "culture", location: "Kandy", dateTaken: "2025-07-02", credit: "Unsplash", title: "Temple of the Sacred Tooth Relic" },
  { id: "nine-arches", url: u("1566296314736-6eaac1ca0cb9", "4:3"), aspect: "landscape", category: "vehicles", location: "Ella", dateTaken: "2025-03-21", credit: "Unsplash", title: "The blue train on Nine Arches Bridge" },
  { id: "rice-curry", url: u("1742281095650-dd3c50c08772", "1:1"), aspect: "square", category: "food", location: "Kandy", dateTaken: "2025-07-02", credit: "Unsplash", title: "Rice & curry on a lotus leaf" },
  { id: "leopard", url: u("1728455470905-156f4278056a", "3:4"), aspect: "portrait", category: "nature", location: "Yala National Park", dateTaken: "2025-02-10", credit: "Unsplash", title: "Leopard at rest, Yala" },
  { id: "stilt-fishermen", url: u("1519566335946-e6f65f0f4fdf", "4:3"), aspect: "landscape", category: "culture", location: "Koggala", dateTaken: "2025-01-18", credit: "Unsplash", title: "Stilt fishermen at dawn" },
  { id: "tea-hills", url: u("1760532511219-c8b7566f90af", "3:4"), aspect: "portrait", category: "nature", location: "Nuwara Eliya", dateTaken: "2025-03-20", credit: "Unsplash", title: "Misty tea estates" },
  { id: "street-portrait", url: u("1675910098897-2c23e1741fe7", "3:4"), aspect: "portrait", category: "portraits", location: "Sri Lanka", dateTaken: "2024-11-05", credit: "Unsplash", title: "Morning tea break" },
  { id: "dambulla-cave", url: u("1756670164679-83f5fa92d1e1", "4:3"), aspect: "landscape", category: "culture", location: "Dambulla", dateTaken: "2025-08-13", credit: "Unsplash", title: "Golden Buddhas in the cave temple" },
  { id: "breakfast", url: u("1742281095661-29de44440bb6", "4:3"), aspect: "landscape", category: "food", location: "Galle", dateTaken: "2025-01-19", credit: "Unsplash", title: "Sri Lankan breakfast spread" },
  { id: "tuk-tuk-lighthouse", url: u("1704797390325-b057758d8c3d", "3:4"), aspect: "portrait", category: "vehicles", location: "Galle Fort", dateTaken: "2025-01-19", credit: "Unsplash", title: "Tuk-tuk by the Galle lighthouse" },
  { id: "elephants", url: u("1533484482814-3fe2d922be89", "4:3"), aspect: "landscape", category: "nature", location: "Minneriya", dateTaken: "2025-08-15", credit: "Unsplash", title: "Elephants at the water's edge" },
  { id: "golden-buddha", url: u("1704798690646-92524b61ce03", "1:1"), aspect: "square", category: "culture", location: "Dambulla", dateTaken: "2025-08-13", credit: "Unsplash", title: "The Golden Temple, Dambulla" },
  { id: "waterfall", url: u("1609681980718-340e7f4b11d7", "3:4"), aspect: "portrait", category: "nature", location: "Hill Country", dateTaken: "2025-03-22", credit: "Unsplash", title: "Waterfall in the highlands" },
  { id: "curries", url: u("1743525700011-afac212694d7", "3:4"), aspect: "portrait", category: "food", location: "Colombo", dateTaken: "2024-12-09", credit: "Unsplash", title: "A table of homemade curries" },
  { id: "highland-portrait", url: u("1751660769801-43c0b1161c85", "1:1"), aspect: "square", category: "portraits", location: "Sri Lanka", dateTaken: "2025-03-20", credit: "Unsplash", title: "A smile in the highlands" },
  { id: "tuk-tuk-road", url: u("1776331246147-2ddb249b92ec", "4:3"), aspect: "landscape", category: "vehicles", location: "Hill Country", dateTaken: "2025-03-21", credit: "Unsplash", title: "Winding roads by tuk-tuk" },
  { id: "rock-aerial", url: u("1711797750174-c3750dd9d7c9", "4:3"), aspect: "landscape", category: "nature", location: "Cultural Triangle", dateTaken: "2025-08-14", credit: "Unsplash", title: "Rock outcrops over the jungle" },
  { id: "temple-white", url: u("1742281998803-382acf73c2a3", "3:4"), aspect: "portrait", category: "culture", location: "Sri Lanka", dateTaken: "2024-12-10", credit: "Unsplash", title: "Buddhist temple at noon" },
  { id: "palm-beach", url: u("1580910527739-556eb89f9d65", "4:3"), aspect: "landscape", category: "nature", location: "South coast", dateTaken: "2025-01-20", credit: "Unsplash", title: "Palms on the south coast" },
  { id: "rice-plate", url: u("1743674453123-93356ade2891", "1:1"), aspect: "square", category: "food", location: "Kandy", dateTaken: "2025-07-03", credit: "Unsplash", title: "Lunch with a local family" },
  { id: "train-forest", url: u("1578519050142-afb511e518de", "3:4"), aspect: "portrait", category: "vehicles", location: "Ella", dateTaken: "2025-03-21", credit: "Unsplash", title: "Through the forest by train" },
  { id: "red-tuk-tuk", url: u("1776331714423-d1e00d511151", "4:3"), aspect: "landscape", category: "vehicles", location: "Colombo", dateTaken: "2024-12-09", credit: "Unsplash", title: "Red tuk-tuk, sunny street" },
  { id: "tooth-lake", url: u("1665849050332-8d5d7e59afb6", "4:3"), aspect: "landscape", category: "culture", location: "Kandy", dateTaken: "2025-07-02", credit: "Unsplash", title: "Golden roof of the Temple of the Tooth" },
  { id: "east-coast", url: u("1734279135115-6d8984e08206", "4:3"), aspect: "landscape", category: "nature", location: "East coast", dateTaken: "2025-06-11", credit: "Unsplash", title: "Turquoise bays of the east coast" },
];


export const expertise: ExpertiseField[] = [
  {
    id: "history",
    title: "Ancient History",
    summary: "Temple tours, UNESCO sites, deep context.",
    description: "Eight of Sri Lanka's sites are UNESCO-listed and I've spent twelve years reading their stones. Expect kings, monks, irrigation engineers and the occasional palace intrigue, told in clear Italian, with time to stand still.",
    activities: [
      "Sigiriya at opening time, before the heat and the crowds",
      "Polonnaruwa by bicycle",
      "Evening puja at the Temple of the Tooth",
      "Dambulla cave temples",
    ],
    images: ["sigiriya", "dambulla-cave", "tooth-lake"],
  },
  {
    id: "leisure",
    title: "Leisure & Food",
    summary: "Food tours, tea estate strolls, beach days.",
    description: "The slow side of the island: cooking with a family in Kandy, tasting single-estate teas where they're grown, and long lunches by the sea in Galle. Ideal for honeymooners and families.",
    activities: [
      "Market walk and home cooking class",
      "Tea factory tour and tasting",
      "Galle Fort sunset walk",
      "Ayurvedic spa afternoon",
    ],
    images: ["rice-curry", "tea-hills", "breakfast"],
  },
  {
    id: "wildlife",
    title: "Wildlife & Nature",
    summary: "Safaris, birdwatching, national parks.",
    description: "Leopards in Yala, the elephant 'gathering' at Minneriya, whales off Mirissa. I work with trusted jeep drivers who respect the animals and the park rules.",
    activities: [
      "Yala dawn jeep safari",
      "Minneriya elephant gathering (Jul–Oct)",
      "Birdwatching at Kumana",
      "Rainforest walk in Sinharaja",
    ],
    images: ["leopard", "elephants", "waterfall"],
  },
  {
    id: "photography",
    title: "Photography Tours",
    summary: "Best light, local tips, iconic and hidden spots.",
    description: "I plan the day around the light: blue hour at Nine Arches, golden hour on Sigiriya's sister rock, portraits at the fish market with permission and respect.",
    activities: [
      "Sunrise from Pidurangala rock",
      "Nine Arches train timing",
      "Stilt fishermen at dawn",
      "Street portraits in Pettah market",
    ],
    images: ["nine-arches", "stilt-fishermen", "street-portrait"],
  },
];

export const itineraries: ItinerarySample[] = [
  {
    id: "cultural-triangle",
    title: "Cultural Triangle",
    duration: "1 day · 10h",
    highlights: [
      "Sigiriya",
      "Polonnaruwa",
      "Temple lunch",
    ],
    priceFrom: 180,
    priceTo: 260,
    description: "Climb the Lion Rock at opening time, then cycle through the 12th-century royal city of Polonnaruwa. Lunch is home-cooked rice & curry near a village temple.",
    tags: ["history", "photography"],
    stops: [
      { name: "Sigiriya", lat: 7.957, lng: 80.76 },
      { name: "Polonnaruwa", lat: 7.94, lng: 81.0 },
      { name: "Dambulla", lat: 7.856, lng: 80.649 },
    ],
    image: "sigiriya",
  },
  {
    id: "kandy",
    title: "Kandy & the Sacred Tooth",
    duration: "1 day · 9h",
    highlights: [
      "Temple of the Tooth",
      "Peradeniya Gardens",
      "Kandyan dance",
    ],
    priceFrom: 140,
    priceTo: 200,
    description: "The last royal capital: orchids and giant bamboo at Peradeniya, a cooking lesson with a local family, then the evening puja at the Temple of the Tooth.",
    tags: ["history", "leisure"],
    stops: [
      { name: "Kandy", lat: 7.2936, lng: 80.6413 },
      { name: "Peradeniya", lat: 7.269, lng: 80.596 },
    ],
    image: "tooth-temple",
  },
  {
    id: "tea-country",
    title: "Tea Country & Nine Arches",
    duration: "2 days",
    highlights: [
      "Nuwara Eliya",
      "Scenic train to Ella",
      "Nine Arches Bridge",
    ],
    priceFrom: 320,
    priceTo: 450,
    description: "Tea tasting in 'Little England', the island's most beautiful train ride, and sunrise over the Nine Arches Bridge, with an overnight in a colonial bungalow.",
    tags: ["leisure", "photography"],
    stops: [
      { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891 },
      { name: "Ella", lat: 6.8667, lng: 81.0466 },
    ],
    image: "tea-hills",
  },
  {
    id: "yala",
    title: "Yala Leopard Safari",
    duration: "1 day · 11h",
    highlights: [
      "Dawn jeep safari",
      "Birdwatching",
      "Lagoon lunch",
    ],
    priceFrom: 210,
    priceTo: 290,
    description: "Sri Lanka has one of the highest leopard densities in the world. We enter Yala at gate opening with a trusted driver, then rest over a lagoon-side lunch.",
    tags: ["wildlife", "photography"],
    stops: [
      { name: "Yala", lat: 6.3725, lng: 81.5185 },
      { name: "Tissamaharama", lat: 6.2783, lng: 81.2876 },
    ],
    image: "leopard",
  },
  {
    id: "galle",
    title: "Galle Fort & the South Coast",
    duration: "1 day · 8h",
    highlights: [
      "Galle Fort",
      "Stilt fishermen",
      "Seafood lunch",
    ],
    priceFrom: 130,
    priceTo: 190,
    description: "Walk the ramparts of the Dutch fort, meet the stilt fishermen of Koggala and finish with grilled fish and a sunset on the lighthouse walls.",
    tags: ["history", "leisure", "photography"],
    stops: [
      { name: "Galle", lat: 6.0269, lng: 80.217 },
      { name: "Koggala", lat: 5.99, lng: 80.32 },
    ],
    image: "stilt-fishermen",
  },
  {
    id: "grand-tour",
    title: "The Grand Tour",
    duration: "7 days",
    highlights: [
      "Cultural Triangle",
      "Kandy & tea country",
      "Yala & the south coast",
    ],
    priceFrom: 1150,
    priceTo: 1600,
    description: "The whole island in one unhurried week: ancient cities, the hill country by train, a leopard safari and two days by the sea. Hotels chosen to match your budget.",
    tags: ["history", "leisure", "wildlife", "photography"],
    stops: [
      { name: "Negombo", lat: 7.2083, lng: 79.8358 },
      { name: "Sigiriya", lat: 7.957, lng: 80.76 },
      { name: "Kandy", lat: 7.2936, lng: 80.6413 },
      { name: "Ella", lat: 6.8667, lng: 81.0466 },
      { name: "Yala", lat: 6.3725, lng: 81.5185 },
      { name: "Galle", lat: 6.0269, lng: 80.217 },
    ],
    image: "nine-arches",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Giulia R.",
    country: "Italy",
    countryCode: "IT",
    rating: 5,
    tour: "Cultural Triangle",
    date: "2025-08-21",
    quote: "Nishan speaks better Italian than some of my colleagues! He got us up Sigiriya before the crowds and told the story of King Kashyapa like a novel. The best day of our honeymoon.",
  },
  {
    id: "t2",
    author: "Marco & Elena",
    country: "Italy",
    countryCode: "IT",
    rating: 5,
    tour: "The Grand Tour",
    date: "2025-03-30",
    quote: "Seven days, zero stress. Hotels, trains, safari: he handled everything, and with two kids that is worth gold. The cooking class with his aunt in Kandy was unforgettable.",
  },
  {
    id: "t3",
    author: "Francesca B.",
    country: "Switzerland",
    countryCode: "CH",
    rating: 5,
    tour: "Yala Leopard Safari",
    date: "2025-02-14",
    quote: "Three leopards in one morning! Nishan chose a driver who respects the animals: no chasing, no crowding. Professional, punctual and genuinely kind.",
  },
  {
    id: "t4",
    author: "Luca P.",
    country: "Italy",
    countryCode: "IT",
    rating: 5,
    tour: "Photography tour",
    date: "2024-12-12",
    quote: "As a photographer I'm demanding about light and timing. Nishan knew exactly when the blue train would cross Nine Arches. I came home with my best portfolio in years.",
  },
  {
    id: "t5",
    author: "Sophie M.",
    country: "France",
    countryCode: "FR",
    rating: 5,
    tour: "Galle Fort & South Coast",
    date: "2025-01-22",
    quote: "We booked the English tour and loved it. Relaxed pace, great seafood and so much history packed into Galle's little streets. Highly recommended.",
  },
  {
    id: "t6",
    author: "Andrea T.",
    country: "Italy",
    countryCode: "IT",
    rating: 4,
    tour: "Kandy & the Sacred Tooth",
    date: "2025-07-05",
    quote: "A guide who explains Buddhism with respect and without clichés. Lots of traffic in Kandy, but Nishan always had a plan B. I'd travel with him again.",
  },
];

export const faqs: FaqItem[] = [
  {
    id: "booking",
    question: "How do I book a tour?",
    answer: "Send me a WhatsApp message with your dates, group size and interests. I reply within 12 hours with a proposal. A 20% deposit confirms the date; the rest is paid on the day.",
  },
  {
    id: "cancellation",
    question: "What is your cancellation policy?",
    answer: "Free cancellation up to 7 days before the tour (full deposit refund). Within 7 days the deposit is kept, but you can move the date once for free. If I must cancel for weather or safety, you get a full refund.",
  },
  {
    id: "payment",
    question: "Which payment methods do you accept?",
    answer: "Deposits by bank transfer (SEPA-friendly via Wise) or PayPal. On the day: cash in USD, EUR or LKR, or card via a mobile terminal.",
  },
  {
    id: "tipping",
    question: "Should I tip?",
    answer: "Tips are never expected but always appreciated. As a guideline, travellers usually give drivers around USD 5–10 per day; for guides it's entirely up to you.",
  },
  {
    id: "bring",
    question: "What should I bring?",
    answer: "Light clothes that cover shoulders and knees for temples (and socks, because temple floors get hot!), sun cream, a hat, a refillable water bottle and some small cash for offerings.",
  },
  {
    id: "safety",
    question: "Safety and accommodation tips for Italian travellers?",
    answer: "Sri Lanka is a welcoming, safe destination. Apply for the ETA visa online before you fly, get travel insurance that covers health, and register on 'Dove Siamo nel Mondo' (Farnesina). I can recommend hotels I've personally visited in every price range.",
  },
];

export const staticContent: SiteContent = {
  guide,
  credentials,
  gallery,
  expertise,
  itineraries,
  testimonials,
  faqs,
};
