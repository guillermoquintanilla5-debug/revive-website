import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDocument from "../../components/ArticleDocument";
import { POSTS, getPost, imageUrl, postUrl } from "../../lib/blog";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = postUrl(post.slug);
  const ogImage = imageUrl(post.image.src);

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url,
      type: "article",
      siteName: "Revive Roof Solutions",
      publishedTime: post.datePublished,
      modifiedTime: post.datePublished,
      images: [
        {
          url: ogImage,
          width: post.image.width,
          height: post.image.height,
          alt: post.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <ArticleDocument post={post} />;
}
