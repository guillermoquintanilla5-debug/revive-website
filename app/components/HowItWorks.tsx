import Image from "next/image";
import HowItWorksStage from "./HowItWorksStage";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="hiw" aria-labelledby="hiw-heading">
      <HowItWorksStage
        media={
          <div className="hiw-media" aria-hidden="true">
            <Image
              src="/images/how-it-works-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={75}
              loading="lazy"
              className="hiw-bg"
            />
            <div className="hiw-overlay" />
          </div>
        }
      >
        <header className="hiw-heading">
          <h2
            id="hiw-heading"
            className="hiw-title hero-headline font-extrabold lg:text-[clamp(2.85rem,4.85vw,4.5rem)] lg:leading-[1.06] lg:tracking-[0.038em]"
          >
            <span className="hiw-title-or">Replace or </span>
            <span className="hiw-title-revive">
              <span className="hiw-title-revive-word">Revive</span>
              <span className="hiw-title-mark">?</span>
            </span>
          </h2>
          <p className="hiw-sub hero-sub font-normal lg:text-[clamp(17px,1.82vw,31px)] lg:leading-[1.4] lg:tracking-[0.035em]">
            See why homeowners choose roof rejuvenation.
          </p>
        </header>
      </HowItWorksStage>
    </section>
  );
}
