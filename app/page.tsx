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

export default function Home() {
  return (
    <>
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
