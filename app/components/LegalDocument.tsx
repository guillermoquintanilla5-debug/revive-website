import Navbar from "./Navbar";
import Footer from "./Footer";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: readonly string[] }
  | {
      type: "contact";
      company: string;
      email: string;
      phone: string;
      phoneHref: string;
      area?: string;
    };

export type LegalSection = {
  id: string;
  number: string;
  title: string;
  blocks: readonly LegalBlock[];
};

export default function LegalDocument({
  title,
  headingId,
  company,
  effective,
  sections,
}: {
  title: string;
  headingId: string;
  company: string;
  effective: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <main>
        <Navbar />
        <article className="legal-page" aria-labelledby={headingId}>
          <div className="legal-shell">
            <header className="legal-masthead">
              <p className="legal-eyebrow">Legal</p>
              <h1 id={headingId} className="legal-title">
                {title}
              </h1>
              <p className="legal-company">{company}</p>
              <p className="legal-effective">Effective {effective}</p>
            </header>

            <div className="legal-rule" aria-hidden="true" />

            <div className="legal-body">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="legal-section"
                  aria-labelledby={`${section.id}-heading`}
                >
                  <p className="legal-index" aria-hidden="true">
                    {section.number}
                  </p>
                  <h2 id={`${section.id}-heading`} className="legal-heading">
                    {section.title}
                  </h2>
                  {section.blocks.map((block, index) => (
                    <LegalBlockView
                      key={`${section.id}-${index}`}
                      block={block}
                    />
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  if (block.type === "p") {
    return <p className="legal-copy">{block.text}</p>;
  }

  if (block.type === "ul") {
    return (
      <ul className="legal-list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <address className="legal-address">
      <p>{block.company}</p>
      <p>
        <span className="legal-label">Email</span>
        <a href={`mailto:${block.email}`}>{block.email}</a>
      </p>
      <p>
        <span className="legal-label">Phone</span>
        <a href={block.phoneHref}>{block.phone}</a>
      </p>
      {block.area ? (
        <p>
          <span className="legal-label">Service Area</span>
          <span>{block.area}</span>
        </p>
      ) : null}
    </address>
  );
}
