import Landing from "@/components/landing/Landing";
import { staticContent } from "@/content/guide";
import { siteUrl } from "@/lib/site";

/* domain/ — "in the making" page; visitors go to a guide's own link, domain/<guide-name>. */
export default function LandingPage() {
  const photo = staticContent.gallery.find((g) => g.id === "nine-arches") ?? staticContent.gallery[0];
  return <Landing host={new URL(siteUrl).host} photo={photo.url} photoAlt={`${photo.title}, ${photo.location}`} />;
}
