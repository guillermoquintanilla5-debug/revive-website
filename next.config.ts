import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80],
  },
  async redirects() {
    return [
      {
        source: "/post/what-is-roof-rejuvenation",
        destination: "/blog/what-is-roof-rejuvenation",
        permanent: true,
      },
      {
        source: "/post/5-signs-your-roof-needs-rejuvenation-not-replacement",
        destination: "/blog/5-signs-your-roof-needs-rejuvenation",
        permanent: true,
      },
      {
        source: "/post/roof-replacement-costs-in-ottawa-vs-roof-rejuvenation-savings",
        destination: "/blog/roof-replacement-costs-ottawa-vs-roof-rejuvenation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
