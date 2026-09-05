export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reviveroofing.ca";

export const QUOTE_HREF = "https://revive-quote-app.vercel.app/quote-request";

export const FACEBOOK_PROFILE =
  "https://www.facebook.com/profile.php?id=61590583869973";
export const INSTAGRAM_PROFILE = "https://www.instagram.com/reviveroofsolutions/";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: readonly string[] };

export type BlogPost = {
  slug: string;
  title: string;
  cardTitle: string;
  excerpt: string;
  intro: string;
  author: string;
  dateLabel: string;
  datePublished: string;
  readTime: string;
  category: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    position: string;
    ratio: "portrait" | "application" | "square";
  };
  seoTitle: string;
  seoDescription: string;
  body: readonly BlogBlock[];
  faqs?: readonly { question: string; answer: string }[];
};

export const POSTS: readonly BlogPost[] = [
  {
    slug: "what-is-roof-rejuvenation",
    title: "What Is Roof Rejuvenation?",
    cardTitle: "What Is Roof Rejuvenation?",
    excerpt:
      "Roof rejuvenation restores flexibility to aging asphalt shingles without tearing off and replacing the roof.",
    intro:
      "Roof rejuvenation is a treatment that restores flexibility and life to aging asphalt shingles without tearing off and replacing the roof. It's a newer alternative to full roof replacement, and one most homeowners have never heard of, simply because it hasn't been widely available until recently.",
    author: "Revive Team",
    dateLabel: "Aug 12",
    datePublished: "2026-08-12",
    readTime: "3 min read",
    category: "Roof Education",
    image: {
      src: "/images/blog-rejuvenation-application.jpg",
      alt: "A gloved hand spraying roof rejuvenation treatment onto dark asphalt shingles.",
      width: 1206,
      height: 1504,
      position: "72% 28%",
      ratio: "application",
    },
    seoTitle: "What Is Roof Rejuvenation? | Revive Roof Solutions",
    seoDescription:
      "Learn how roof rejuvenation works, how it restores aging asphalt shingles, what treatment involves, and whether your roof may qualify.",
    faqs: [
      {
        question: "Does roof rejuvenation really work?",
        answer:
          "Yes, for roofs that are still structurally sound. The treatment restores oils that have evaporated from aging shingles, which is what causes the brittleness and cracking that lead to leaks and failure.",
      },
      {
        question: "Is my roof a good candidate?",
        answer:
          "Roofs between 8–20 years old, with asphalt shingles that look dry or faded but are otherwise intact, are typically the best candidates. A free assessment is the fastest way to know for sure.",
      },
      {
        question: "Does it smell or make a mess?",
        answer:
          "The treatment is sprayed on and dries clear within hours. There's no tear-off, no debris, and no disruption to your property.",
      },
    ],
    body: [
      {
        type: "h2",
        text: "How Roof Rejuvenation Works",
      },
      {
        type: "p",
        text: "As asphalt shingles age, the natural oils inside them evaporate. That's what makes older shingles look dry, faded, and brittle, and it's also what makes them prone to cracking under wind, heat, and cold. Once those oils are gone, shingles lose the flexibility they need to expand and contract with the weather, which is when real damage starts.",
      },
      {
        type: "p",
        text: "Our roof rejuvenation treatment is a plant-based (soy oil) formula applied directly to the shingles. The oil molecules are small enough to penetrate into the asphalt itself, not just sit on the surface, where they replenish the oils the shingles have lost. This restores flexibility to the shingle and helps it perform closer to how it did when it was new. The treatment also forms a protective layer that slows down future oil evaporation and improves water repulsion, reducing the moisture absorption that leads to mold and deck damage over time.",
      },
      {
        type: "h2",
        text: "What Happens During Treatment",
      },
      {
        type: "p",
        text: "The treatment is applied with a spray, going on white and drying clear. Your roof keeps its original color once it's done. For a typical residential roof, the entire process takes 1 to 3 hours, with no tear-off, no dumpster, and minimal disruption to your home or landscaping.",
      },
      {
        type: "p",
        text: "At Revive Roof Solutions, every assessment starts with a free drone inspection, so we can document your roof's condition before and after treatment and give you an honest read on whether rejuvenation is the right fit.",
      },
      {
        type: "h2",
        text: "How Long Does It Last?",
      },
      {
        type: "p",
        text: "Roof rejuvenation isn't meant to last forever the way a full replacement resets the clock, but it meaningfully extends the life of shingles that still have structural integrity left. Every qualifying project with Revive Roof Solutions comes with a 5-year warranty, reflecting our confidence in the treatment's results.",
      },
      {
        type: "h2",
        text: "Is Roof Rejuvenation Right for Your Roof?",
      },
      {
        type: "p",
        text: "Rejuvenation works best on roofs that are still structurally sound but showing their age.",
      },
      {
        type: "p",
        text: "Your roof is likely a good candidate if:",
      },
      {
        type: "ul",
        items: [
          "It's 8 to 20 years old",
          "It has asphalt shingles",
          "The shingles look dry or faded, but aren't curling, cracked through, or missing",
          "The roof has no major structural issues",
        ],
      },
      {
        type: "p",
        text: "If your roof is past that window or has significant damage, we'll tell you honestly that replacement is the better option. Rejuvenation isn't a fix for every roof, and we don't sell it as one.",
      },
      {
        type: "h2",
        text: "Roof Rejuvenation vs. Roof Replacement",
      },
      {
        type: "p",
        text: "The biggest difference is cost and time. A full roof replacement in Ottawa typically runs $10,000–$21,000+ and takes days. Roof rejuvenation, for roofs that qualify, can save up to 85% of that cost and is completed in a few hours. It's not a replacement for replacement. It's an option worth ruling out first.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "h3",
        text: "Does roof rejuvenation really work?",
      },
      {
        type: "p",
        text: "Yes, for roofs that are still structurally sound. The treatment restores oils that have evaporated from aging shingles, which is what causes the brittleness and cracking that lead to leaks and failure.",
      },
      {
        type: "h3",
        text: "Is my roof a good candidate?",
      },
      {
        type: "p",
        text: "Roofs between 8–20 years old, with asphalt shingles that look dry or faded but are otherwise intact, are typically the best candidates. A free assessment is the fastest way to know for sure.",
      },
      {
        type: "h3",
        text: "Does it smell or make a mess?",
      },
      {
        type: "p",
        text: "The treatment is sprayed on and dries clear within hours. There's no tear-off, no debris, and no disruption to your property.",
      },
    ],
  },
  {
    slug: "5-signs-your-roof-needs-rejuvenation",
    title: "5 Signs Your Roof Needs Rejuvenation (Not Replacement)",
    cardTitle: "5 Signs Your Roof Needs Rejuvenation\n(Not Replacement)",
    excerpt:
      "Not sure if your roof needs replacement? These are the clearest signs your roof may be a candidate for rejuvenation instead.",
    intro:
      "Not sure if your roof needs replacement? These are the clearest signs your roof needs rejuvenation instead, and could save you thousands. From Revive Roof Solutions.",
    author: "Revive Team",
    dateLabel: "Aug 12",
    datePublished: "2026-08-12",
    readTime: "2 min read",
    category: "Roof Education",
    image: {
      src: "/images/blog-signs-dry-shingles.jpg",
      alt: "Close-up of dry, faded asphalt shingles with a chalky granular surface.",
      width: 1010,
      height: 1560,
      position: "50% 45%",
      ratio: "portrait",
    },
    seoTitle: "5 Signs Your Roof Needs Rejuvenation | Revive Roof Solutions",
    seoDescription:
      "Learn the key signs that your asphalt shingle roof may qualify for roof rejuvenation instead of full replacement.",
    body: [
      {
        type: "h2",
        text: "1. Your Shingles Look Dry, Faded, or Chalky",
      },
      {
        type: "p",
        text: "This is usually the earliest visible sign. As asphalt shingles age, the natural oils inside them evaporate, and that's what gives them a dry, faded, chalky look instead of their original color. It doesn't mean the shingles have failed. It means they're aging in exactly the way rejuvenation is designed to address.",
      },
      {
        type: "h2",
        text: "2. Your Roof Is Between 8 and 20 Years Old",
      },
      {
        type: "p",
        text: "This is the sweet spot for rejuvenation. Young enough that the shingle structure and decking are still intact, old enough that the shingles have genuinely lost the flexibility that comes with new oils. Roofs outside this range need a closer look before rejuvenation makes sense.",
      },
      {
        type: "h2",
        text: "3. The Shingles Bend Without Cracking",
      },
      {
        type: "p",
        text: "Watch how your shingles handle wind, or gently check a corner or edge. If they flex without snapping, crumbling, or breaking apart, there's still workable material for a rejuvenation treatment to restore. Shingles that crack or shatter when they move have gone past the point rejuvenation can help.",
      },
      {
        type: "h2",
        text: "4. There's No Sign of Structural Damage",
      },
      {
        type: "p",
        text: "Sagging areas, soft spots in the decking, or widespread missing shingles point to problems rejuvenation can't fix. If the structure underneath is sound and it's really just the shingle surface that's aged, you're a strong candidate.",
      },
      {
        type: "h2",
        text: "5. You'd Rather Not Spend $10,000+ Right Now",
      },
      {
        type: "p",
        text: "A full roof replacement in Ottawa typically runs $10,000 to $21,000, and can climb higher depending on your home. If your roof qualifies, rejuvenation can save up to 85% of that cost and is completed in 1 to 3 hours instead of days.",
      },
      {
        type: "h2",
        text: "These Are the Signs Your Roof Needs Rejuvenation",
      },
      {
        type: "p",
        text: "Every assessment with Revive Roof Solutions starts free, including a drone inspection so you get a clear, documented look at your roof's condition. If your roof qualifies, the work is backed by a 5-year warranty. If it doesn't, we'll tell you that too.",
      },
    ],
  },
  {
    slug: "roof-replacement-costs-ottawa-vs-roof-rejuvenation",
    title: "Roof Replacement Costs in Ottawa vs. Roof Rejuvenation Savings",
    cardTitle: "Roof Replacement Costs in Ottawa\nvs. Roof Rejuvenation Savings",
    excerpt:
      "See how roof rejuvenation compares with the cost, time, and disruption of full roof replacement in Ottawa.",
    intro:
      "If you're staring at cracked, dry, or fading asphalt shingles, you're probably assuming a full roof replacement is your only option, and wondering what the roof replacement cost in Ottawa really looks like. In many cases, a much less expensive treatment can add years back to your existing roof.",
    author: "Revive Team",
    dateLabel: "Aug 11",
    datePublished: "2026-08-11",
    readTime: "2 min read",
    category: "Roof Education",
    image: {
      src: "/images/blog-asphalt-shingle-roof.jpg",
      alt: "Sunlit asphalt shingle roof on a residential home, with a neighboring house in the background.",
      width: 1024,
      height: 1024,
      position: "42% 38%",
      ratio: "square",
    },
    seoTitle: "Roof Replacement Cost Ottawa vs. Rejuvenation | Revive",
    seoDescription:
      "Compare typical roof replacement costs in Ottawa with roof rejuvenation and learn when rejuvenation may save homeowners up to 85%.",
    body: [
      {
        type: "h2",
        text: "The Real Cost of Roof Replacement in Ottawa",
      },
      {
        type: "p",
        text: "Roof replacement is one of the biggest expenses a homeowner will face. In 2026, a typical asphalt shingle roof replacement in Ottawa runs $10,000 to $21,000, and can climb higher for larger homes or premium materials. Ottawa's climate adds to the cost too. The city's freeze-thaw cycles and ice-damming risk mean local building code requires ice-and-water shield along the eaves, which most other regions don't need.",
      },
      {
        type: "p",
        text: "A few things that push the price up:",
      },
      {
        type: "ul",
        items: [
          "Roof size and complexity. Larger roofs, steep pitches, or multiple valleys need more materials and labor.",
          "Material choice. Premium shingles, metal, or slate cost significantly more than standard asphalt.",
          "Tear-off and disposal. Removing the old roof and hauling away the debris adds to the bill before a single new shingle goes down.",
          "Structural repairs. If the tear-off reveals damaged decking, that's an added cost most homeowners don't budget for.",
        ],
      },
      {
        type: "h2",
        text: "Roof Rejuvenation: A Fraction of the Cost",
      },
      {
        type: "p",
        text: "Roof rejuvenation is a treatment that restores life to aging asphalt shingles instead of tearing them off. As shingles age, the oils inside them dry out, making them brittle and prone to cracking. A rejuvenation treatment penetrates the shingle and replenishes those oils, restoring flexibility and helping the roof perform like a much younger one.",
      },
      {
        type: "p",
        text: "For homeowners whose roof qualifies, rejuvenation can save up to 85% compared to a full replacement. Instead of days of tear-off and installation, the treatment is applied in 1 to 3 hours, with minimal disruption to your home. At Revive Roof Solutions, every qualifying project is backed by a 5-year warranty.",
      },
      {
        type: "h2",
        text: "Is Your Roof a Good Candidate for Rejuvenation?",
      },
      {
        type: "p",
        text: "Not every roof qualifies. Rejuvenation works best when the underlying shingles are still structurally sound.",
      },
      {
        type: "p",
        text: "Generally, your roof is a good candidate if:",
      },
      {
        type: "ul",
        items: [
          "It's between 8 and 20 years old",
          "It has asphalt shingles",
          "The shingles look dry or faded, but aren't curling or badly damaged",
          "The roof is in good structural condition overall",
        ],
      },
      {
        type: "p",
        text: "If your roof has structural damage or is well past its expected lifespan, replacement may be the right call. We'll tell you honestly if that's the case.",
      },
      {
        type: "h2",
        text: "Which Option Is Right for You?",
      },
      {
        type: "p",
        text: "The honest answer is: it depends on your roof's condition. That's exactly why we offer a free assessment before recommending anything. We'll inspect your roof (including a drone inspection for a complete before-and-after record), tell you plainly whether rejuvenation is a fit, and give you a real number so you can compare it against replacement costs yourself.",
      },
    ],
  },
];

export const FEATURED_SLUG = "what-is-roof-rejuvenation";

export function getPost(slug: string) {
  return POSTS.find((post) => post.slug === slug);
}

export function getFeaturedPost() {
  return POSTS.find((post) => post.slug === FEATURED_SLUG) ?? POSTS[0];
}

export function getSecondaryPosts() {
  return POSTS.filter((post) => post.slug !== FEATURED_SLUG);
}

export function getRelatedPosts(slug: string) {
  return POSTS.filter((post) => post.slug !== slug);
}

export function postPath(slug: string) {
  return `/blog/${slug}`;
}

export function postUrl(slug: string) {
  return `${SITE_URL}${postPath(slug)}`;
}

export function facebookShareUrl(slug: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl(slug))}`;
}

export function blogIndexUrl() {
  return `${SITE_URL}/blog`;
}

export function imageUrl(src: string) {
  return `${SITE_URL}${src}`;
}
