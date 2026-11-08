import Image from "next/image";
import { Phone } from "lucide-react";
import HeroVideo from "./HeroVideo";
import QuoteCta from "./QuoteCta";

export default function Hero() {
  return (
    <section className="hero relative flex w-full flex-col overflow-hidden xl:justify-center xl:pb-[14.8vh]">
      <div className="hero-visual-enter absolute inset-0">
        <Image
          src="/images/hero-poster.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
        <HeroVideo />
      </div>
      <div className="hero-dim absolute inset-0 bg-black/65" />

      <div className="hero-stack relative z-10 flex min-h-min w-full flex-1 flex-col text-center xl:block xl:min-h-0 xl:flex-none xl:px-[clamp(1.25rem,4.5vw,6rem)] xl:pt-0 xl:text-left">
        <div aria-hidden="true" className="hero-flexspace xl:hidden" />

        <h1 className="hero-headline-enter hero-headline font-extrabold xl:text-[clamp(2.1875rem,5.35vw,5.875rem)] xl:leading-[1.06] xl:tracking-[0.038em]">
          <span className="hero-title-mobile xl:hidden">
            <span className="block">
              <span className="hero-accent text-revive-green">Save Thousands</span>{" "}
              <span className="hero-ink text-white">with</span>
            </span>
            <span className="hero-accent block whitespace-nowrap text-revive-green">Roof Rejuvenation</span>
            <span className="hero-ink block text-white">in Ottawa</span>
          </span>
          <span className="hero-title-desktop hidden xl:block">
            <span className="block">
              <span className="hero-accent text-revive-green">Save Thousands</span> <span className="hero-ink text-white">with</span>
            </span>
            <span className="block">
              <span className="hero-accent text-revive-green">Roof Rejuvenation</span> <span className="hero-ink text-white">in Ottawa</span>
            </span>
          </span>
        </h1>

        <p className="hero-sub-enter hero-sub font-normal xl:mx-0 xl:mt-[clamp(0.625rem,2vw,1.75rem)] xl:max-w-[24.5em] xl:text-[clamp(1.0625rem,1.82vw,1.9375rem)] xl:leading-[1.4] xl:tracking-[0.035em] xl:text-white">
          Professional roof rejuvenation and exterior home services throughout Ottawa and surrounding areas.
        </p>

        <div className="hero-cta-spacer xl:hidden" />

        <div className="hero-cta hero-cta-enter xl:mt-[clamp(1.125rem,2.65vw,2.875rem)] xl:flex xl:flex-nowrap xl:items-center xl:justify-start xl:gap-4 xl:translate-y-[clamp(1.75rem,5.5vw,4.5rem)]">
          <span className="hero-mob-cta xl:hidden">
            <QuoteCta size="heroMobile">Free Quote</QuoteCta>
          </span>
          <QuoteCta size="hero" className="hero-desk-quote">
            Get Your Free Quote
          </QuoteCta>
          <a
            href="https://api.whatsapp.com/send?phone=16137013088"
            className="hero-desk-contact"
          >
            <span className="quote-cta-label">
              <span>Contact Us</span>
              <span aria-hidden="true">Contact Us</span>
            </span>
            <span className="quote-cta-orb" aria-hidden="true">
              <span className="quote-cta-arrow">
                <Phone strokeWidth={1.75} aria-hidden="true" />
              </span>
            </span>
          </a>
          <span className="hero-mob-cta xl:hidden">
            <a href="tel:+16137013088" className="hero-mob-contact">
              <span className="quote-cta-label">
                <span>
                  Call Now
                  <span className="quote-cta-mark" aria-hidden="true">
                    <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </span>
                <span aria-hidden="true">Call Now</span>
              </span>
              <span className="quote-cta-orb" aria-hidden="true">
                <span className="quote-cta-arrow">
                  <Phone strokeWidth={1.75} aria-hidden="true" />
                </span>
              </span>
            </a>
          </span>
        </div>

        <div aria-hidden="true" className="hero-flexspace xl:hidden" />
      </div>

      <div className="hero-trust relative z-10 flex items-center justify-center xl:absolute xl:right-[clamp(1.25rem,5.42vw,6rem)] xl:bottom-[clamp(1.25rem,8.87vh,6rem)] xl:mx-0 xl:mt-0 xl:mb-0 xl:justify-start xl:gap-[clamp(1.25rem,4.09vw,4.4375rem)] xl:px-0">
        <span className="hero-badge-enter">
          <Image
            src="/images/badge-usda.png"
            alt="USDA Certified Biobased Product"
            width={640}
            height={305}
            sizes="(min-width: 1280px) 12vw, 32vw"
            className="hero-badge-usda h-auto xl:w-[clamp(7.5rem,11.25vw,12.375rem)]"
          />
        </span>
        <span className="hero-badge-enter">
          <Image
            src="/images/badge-soy.png"
            alt="It's Sustainably Soy Certified"
            width={512}
            height={455}
            sizes="(min-width: 1280px) 8vw, 20vw"
            className="hero-badge-soy h-auto xl:w-[clamp(4.625rem,7.0vw,7.6875rem)]"
          />
        </span>
      </div>
    </section>
  );
}
