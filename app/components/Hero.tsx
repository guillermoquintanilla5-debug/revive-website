import Image from "next/image";
import HeroVideo from "./HeroVideo";
import QuoteCta from "./QuoteCta";

export default function Hero() {
  return (
    <section className="hero relative flex w-full flex-col overflow-hidden lg:justify-center lg:pb-[14.8vh]">
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

      <div className="hero-stack relative z-10 flex min-h-min w-full flex-1 flex-col text-center lg:block lg:min-h-0 lg:flex-none lg:px-[clamp(20px,4.5vw,96px)] lg:pt-0 lg:text-left">
        <div aria-hidden="true" className="hero-flexspace lg:hidden" />

        <h1 className="hero-headline-enter hero-headline font-extrabold lg:text-[clamp(35px,5.35vw,94px)] lg:leading-[1.06] lg:tracking-[0.038em]">
          <span className="hero-title-mobile lg:hidden">
            <span className="block">
              <span className="hero-accent text-revive-green">Save Thousands</span>{" "}
              <span className="hero-ink text-white">with</span>
            </span>
            <span className="hero-accent block whitespace-nowrap text-revive-green">Roof Rejuvenation</span>
            <span className="hero-ink block text-white">in Ottawa</span>
          </span>
          <span className="hero-title-desktop hidden lg:block">
            <span className="block">
              <span className="hero-accent text-revive-green">Save Thousands</span> <span className="hero-ink text-white">with</span>
            </span>
            <span className="block">
              <span className="hero-accent text-revive-green">Roof Rejuvenation</span> <span className="hero-ink text-white">in Ottawa</span>
            </span>
          </span>
        </h1>

        <p className="hero-sub-enter hero-sub font-normal lg:mx-0 lg:mt-[clamp(10px,2vw,28px)] lg:max-w-[24.5em] lg:text-[clamp(17px,1.82vw,31px)] lg:leading-[1.4] lg:tracking-[0.035em] lg:text-white">
          Professional roof rejuvenation and exterior home services throughout Ottawa and surrounding areas.
        </p>

        <div className="hero-cta-spacer lg:hidden" />

        <div className="hero-cta hero-cta-enter lg:mt-[clamp(18px,2.65vw,46px)] lg:flex lg:flex-nowrap lg:items-center lg:justify-start lg:gap-4 lg:translate-y-[clamp(28px,5.5vw,72px)]">
          <span className="hero-mob-cta lg:hidden">
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
              <span className="quote-cta-arrow quote-cta-arrow-diag">↗</span>
            </span>
          </a>
          <span className="hero-mob-cta lg:hidden">
            <a href="tel:+16137013088" className="hero-mob-contact">
              <span className="quote-cta-label">
                <span>
                  Call Now
                  <span className="quote-cta-mark" aria-hidden="true">
                    ↗
                  </span>
                </span>
                <span aria-hidden="true">Call Now</span>
              </span>
              <span className="quote-cta-orb" aria-hidden="true">
                <span className="quote-cta-arrow quote-cta-arrow-diag">↗</span>
              </span>
            </a>
          </span>
        </div>

        <div aria-hidden="true" className="hero-flexspace lg:hidden" />
      </div>

      <div className="hero-trust relative z-10 flex items-center justify-center lg:absolute lg:right-[clamp(20px,5.42vw,96px)] lg:bottom-[clamp(20px,8.87vh,96px)] lg:mx-0 lg:mt-0 lg:mb-0 lg:justify-start lg:gap-[clamp(20px,4.09vw,71px)] lg:px-0">
        <span className="hero-badge-enter">
          <Image
            src="/images/badge-usda.png"
            alt="USDA Certified Biobased Product"
            width={640}
            height={305}
            sizes="(min-width: 1024px) 12vw, 32vw"
            className="hero-badge-usda h-auto lg:w-[clamp(120px,11.25vw,198px)]"
          />
        </span>
        <span className="hero-badge-enter">
          <Image
            src="/images/badge-soy.png"
            alt="It's Sustainably Soy Certified"
            width={512}
            height={455}
            sizes="(min-width: 1024px) 8vw, 20vw"
            className="hero-badge-soy h-auto lg:w-[clamp(74px,7.0vw,123px)]"
          />
        </span>
      </div>
    </section>
  );
}
