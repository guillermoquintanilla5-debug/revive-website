import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import SmarterAlternative from "./components/SmarterAlternative";
import Warranty from "./components/Warranty";
import Qualify from "./components/Qualify";
import Process from "./components/Process";
import Gallery from "./components/Gallery";
import BetterExperience from "./components/BetterExperience";
import ServiceArea from "./components/ServiceArea";
import ContactCta from "./components/ContactCta";
import Footer from "./components/Footer";
import {
  FACEBOOK_PROFILE,
  INSTAGRAM_PROFILE,
  SITE_URL,
  imageUrl,
} from "./lib/blog";

const TITLE = "Revive Roof Solutions | Roof Rejuvenation in Ottawa";
const DESCRIPTION =
  "Professional roof rejuvenation and exterior home services throughout Ottawa and surrounding areas.";
const CANONICAL = `${SITE_URL}/`;
const OG_IMAGE = {
  url: imageUrl("/images/hero-poster.jpg"),
  width: 1600,
  height: 899,
  alt: "Aerial view of a residential asphalt shingle roof",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Canonical + og:url are rendered as explicit tags below so the homepage
  // keeps the trailing slash (Metadata API strips it when trailingSlash=false).
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Revive Roof Solutions",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

const roofingContractorLd = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  name: "Revive Roof Solutions Inc.",
  url: CANONICAL,
  logo: imageUrl("/images/logo.png"),
  image: OG_IMAGE.url,
  telephone: "+1-613-701-3088",
  email: "info@reviveroofing.ca",
  description: DESCRIPTION,
  areaServed: [
    {
      "@type": "City",
      name: "Ottawa",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Ontario",
      },
    },
    {
      "@type": "City",
      name: "Gatineau",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Quebec",
      },
    },
    "surrounding communities",
  ],
  sameAs: [FACEBOOK_PROFILE, INSTAGRAM_PROFILE],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Revive Roof Solutions",
  url: CANONICAL,
};

export default function Home() {
  return (
    <>
      <link rel="canonical" href={CANONICAL} />
      <meta property="og:url" content={CANONICAL} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(roofingContractorLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <main>
        <Navbar />
        <Hero />
        <HowItWorks />
        <SmarterAlternative />
        <Warranty />
        <Qualify />
        <Process />
        <Gallery />
        <BetterExperience />
        <ServiceArea />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
