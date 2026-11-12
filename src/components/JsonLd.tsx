import type { SiteContent } from "@/content/types";
import { siteUrl, sizedImage } from "@/lib/site";

/** Structured data: Person (the guide), the guiding Service with reviews, TouristTrips and FAQPage. */
export default function JsonLd({ content, guideSlug }: { content: SiteContent; guideSlug: string }) {
  const { guide, itineraries, testimonials, faqs } = content;
  const pageUrl = `${siteUrl}/${guideSlug}`;
  const personId = `${pageUrl}#guide`;
  const avg = testimonials.length ? testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length : 0;

  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: guide.name,
      jobTitle: guide.title,
      description: guide.shortPitch,
      image: guide.portrait ?? sizedImage(guide.heroImage, 1200),
      url: pageUrl,
      email: `mailto:${guide.contact.email}`,
      telephone: guide.contact.phoneE164,
      knowsLanguage: guide.languages.map((l) => l.code),
      address: { "@type": "PostalAddress", addressLocality: guide.contact.city, addressCountry: guide.contact.countryCode },
      sameAs: Object.values(guide.socials).filter(Boolean),
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: guide.title,
      serviceType: "Tour guide",
      provider: { "@id": personId },
      areaServed: { "@type": "Country", name: new Intl.DisplayNames(["en"], { type: "region" }).of(guide.contact.countryCode) },
      availableLanguage: guide.languages.map((l) => l.code),
      ...(testimonials.length && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: avg.toFixed(1),
          reviewCount: testimonials.length,
          bestRating: 5,
        },
      }),
      review: testimonials.map((t) => ({
        "@type": "Review",
        author: { "@type": "Person", name: t.author },
        datePublished: t.date,
        reviewBody: t.quote,
        reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
      })),
    },
    ...itineraries.map((it) => ({
      "@type": "TouristTrip",
      name: it.title,
      description: it.description,
      touristType: it.tags,
      provider: { "@id": personId },
      itinerary: {
        "@type": "ItemList",
        itemListElement: it.stops.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "TouristAttraction", name: s.name, geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng } },
        })),
      },
      offers: { "@type": "Offer", price: it.priceFrom, priceCurrency: "USD" },
    })),
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
