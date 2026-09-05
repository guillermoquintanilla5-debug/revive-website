import Image from "next/image";
import Link from "next/link";
import {
  FACEBOOK_PROFILE,
  INSTAGRAM_PROFILE,
  SITE_URL,
  getRelatedPosts,
  postUrl,
  type BlogBlock,
  type BlogPost,
} from "../lib/blog";
import BlogCard from "./BlogCard";
import Footer from "./Footer";
import JournalReveal from "./JournalReveal";
import QuoteCta from "./QuoteCta";
import Navbar from "./Navbar";

export default function ArticleDocument({ post }: { post: BlogPost }) {
  const related = getRelatedPosts(post.slug);
  const url = postUrl(post.slug);
  const imageUrl = `${SITE_URL}${post.image.src}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Revive Roof Solutions Inc.",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    image: [imageUrl],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const faqLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <main>
        <Navbar />
        <article className="article-page" aria-labelledby="article-heading">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
          />
          {faqLd ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
            />
          ) : null}

          <header className="article-header">
            <Link href="/blog" className="article-back">
              <span aria-hidden="true">←</span>
              All Posts
            </Link>
            <p className="journal-eyebrow">{post.category}</p>
            <p className="journal-meta">
              <span>{post.author}</span>
              <time dateTime={post.datePublished}>{post.dateLabel}</time>
              <span>{post.readTime}</span>
            </p>
            <h1 id="article-heading" className="article-title">
              {post.title}
            </h1>
            <p className="article-deck">{post.intro}</p>
          </header>

          <figure className={`article-figure article-figure--${post.image.ratio}`}>
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              sizes="(min-width: 1024px) 42rem, 92vw"
              quality={80}
              priority
              className={`journal-photo journal-photo--${post.image.ratio}`}
            />
          </figure>

          <div className="article-body">
            {post.body.map((block, index) => (
              <ArticleBlock key={`${post.slug}-${index}`} block={block} />
            ))}
          </div>

          <aside className="article-share" aria-label="More from Revive">
            <p className="journal-eyebrow">More from Revive</p>
            <ul className="article-share-list">
              <li>
                <a
                  href={FACEBOOK_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </aside>

          <section className="article-cta" aria-labelledby="article-cta-heading">
            <p className="journal-eyebrow">Not sure about your roof?</p>
            <h2 id="article-cta-heading" className="article-cta-title">
              See If Your Roof Qualifies.
            </h2>
            <p className="article-cta-copy">
              A free roof inspection is the fastest way to know whether
              rejuvenation makes sense for your home.
            </p>
            <QuoteCta size="article" className="article-cta-btn">
              Get Your Free Quote
            </QuoteCta>
          </section>
        </article>

        <JournalReveal className="article-related-wrap">
          <section className="article-related" aria-labelledby="related-heading">
            <p id="related-heading" className="journal-eyebrow">
              Related Articles
            </p>
            <div className="journal-grid">
              {related.map((item, index) => (
                <div
                  key={item.slug}
                  className="journal-rise"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BlogCard post={item} />
                </div>
              ))}
            </div>
          </section>
        </JournalReveal>
      </main>
      <Footer />
    </>
  );
}

function ArticleBlock({ block }: { block: BlogBlock }) {
  if (block.type === "h2") {
    return <h2 className="article-h2">{block.text}</h2>;
  }
  if (block.type === "h3") {
    return <h3 className="article-h3">{block.text}</h3>;
  }
  if (block.type === "ul") {
    return (
      <ul className="article-list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="article-copy">{block.text}</p>;
}
