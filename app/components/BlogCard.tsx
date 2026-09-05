import Image from "next/image";
import Link from "next/link";
import { type BlogPost, postPath } from "../lib/blog";

export default function BlogCard({
  post,
  priority = false,
}: {
  post: BlogPost;
  priority?: boolean;
}) {
  return (
    <article className="journal-card">
      <Link href={postPath(post.slug)} className="journal-card-media">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 28rem, (min-width: 700px) 44vw, 92vw"
          quality={80}
          priority={priority}
          className={`journal-photo journal-photo--${post.image.ratio}`}
        />
      </Link>
      <p className="journal-meta">
        <span>{post.author}</span>
        <time dateTime={post.datePublished}>{post.dateLabel}</time>
        <span>{post.readTime}</span>
      </p>
      <h3 className="journal-card-title">
        <Link href={postPath(post.slug)}>{post.cardTitle}</Link>
      </h3>
      <p className="journal-card-excerpt">{post.excerpt}</p>
      <Link href={postPath(post.slug)} className="journal-read">
        Read Article <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
