import Image from "next/image";
import Link from "next/link";
import { getFeaturedPost, getSecondaryPosts, postPath } from "../lib/blog";
import BlogCard from "./BlogCard";
import Footer from "./Footer";
import JournalReveal from "./JournalReveal";
import Navbar from "./Navbar";

export default function BlogIndex() {
  const featured = getFeaturedPost();
  const secondary = getSecondaryPosts();

  return (
    <>
      <main>
        <Navbar />
        <div className="journal">
          <header className="journal-intro" aria-labelledby="blog-heading">
            <p className="journal-eyebrow">Insights</p>
            <h1 id="blog-heading" className="journal-title">
              Roof Care,
              <span>Explained.</span>
            </h1>
            <p className="journal-lede">
              Practical guidance to help Ottawa homeowners understand their
              roof, their options, and when rejuvenation makes sense.
            </p>
          </header>

          <JournalReveal className="journal-featured-wrap">
            <article className="journal-featured">
              <Link
                href={postPath(featured.slug)}
                className="journal-featured-media journal-rise"
              >
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, 92vw"
                  quality={80}
                  priority
                  className={`journal-photo journal-photo--${featured.image.ratio}`}
                />
              </Link>
              <div className="journal-featured-copy journal-rise">
                <h2 className="journal-featured-title">
                  <Link href={postPath(featured.slug)}>{featured.title}</Link>
                </h2>
                <p className="journal-featured-excerpt">{featured.excerpt}</p>
                <p className="journal-meta">
                  <span>{featured.author}</span>
                  <time dateTime={featured.datePublished}>
                    {featured.dateLabel}
                  </time>
                  <span>{featured.readTime}</span>
                </p>
                <Link href={postPath(featured.slug)} className="journal-read">
                  Read Article <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </JournalReveal>

          <JournalReveal className="journal-grid-wrap">
            <div className="journal-grid">
              {secondary.map((post, index) => (
                <div
                  key={post.slug}
                  className="journal-rise"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </JournalReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
