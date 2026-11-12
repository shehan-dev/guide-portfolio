import About from "@/components/About";
import Contact from "@/components/Contact";
import Credentials from "@/components/Credentials";
import Expertise from "@/components/Expertise";
import Faq from "@/components/Faq";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Itineraries from "@/components/Itineraries";
import JsonLd from "@/components/JsonLd";
import Testimonials from "@/components/Testimonials";
import { ui } from "@/content/ui";
import { getSiteContent } from "@/sanity/content";

export default async function GuideHomePage({ params }: { params: Promise<{ guide: string }> }) {
  const { guide } = await params; // validated by the layout
  const content = await getSiteContent(guide);

  return (
    <>
      <a className="skip-link" href="#main">
        {ui.a11y.skip}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Expertise />
        <Itineraries />
        <Testimonials />
        <Gallery />
        <Credentials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
      <JsonLd content={content} guideSlug={guide} />
    </>
  );
}
