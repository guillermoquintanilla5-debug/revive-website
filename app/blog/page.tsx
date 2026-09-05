import type { Metadata } from "next";
import BlogIndex from "../components/BlogIndex";
import { SITE_URL, getFeaturedPost, imageUrl } from "../lib/blog";

const TITLE = "Roof Rejuvenation Blog | Revive Roof Solutions Ottawa";
const DESCRIPTION =
  "Roof rejuvenation advice, asphalt shingle maintenance tips, roof replacement cost information, and homeowner guidance from Revive Roof Solutions in Ottawa.";

const featured = getFeaturedPost();

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "Revive Roof Solutions",
    images: [
      {
        url: imageUrl(featured.image.src),
        width: featured.image.width,
        height: featured.image.height,
        alt: featured.image.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [imageUrl(featured.image.src)],
  },
};

export default function BlogPage() {
  return <BlogIndex />;
}
