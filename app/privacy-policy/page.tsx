import type { Metadata } from "next";
import LegalDocument, {
  type LegalSection,
} from "../components/LegalDocument";
import { SITE_URL, imageUrl } from "../lib/blog";

const TITLE = "Privacy Policy | Revive Roof Solutions";
const DESCRIPTION =
  "Read the Privacy Policy for Revive Roof Solutions and learn how we collect, use, and protect personal information.";
const CANONICAL = `${SITE_URL}/privacy-policy`;
const OG_IMAGE = imageUrl("/images/hero-poster.jpg");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    siteName: "Revive Roof Solutions",
    images: [{ url: OG_IMAGE, width: 1600, height: 899 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    number: "01",
    title: "Who We Are",
    blocks: [
      {
        type: "p",
        text: 'Revive Roof Solutions Inc. ("Revive," "we," "us," or "our") provides roof rejuvenation, roof inspection, and minor roof repair services in the Ottawa, Ontario area. This Privacy Policy explains how we collect, use, and protect the personal information of visitors to our website and customers who request our services.',
      },
    ],
  },
  {
    id: "information-we-collect",
    number: "02",
    title: "Information We Collect",
    blocks: [
      {
        type: "p",
        text: "When you request a free roof assessment or otherwise contact us, we may collect:",
      },
      {
        type: "ul",
        items: [
          "Your name",
          "Property address",
          "Phone number",
          "Email address",
          "Details about your roof (approximate age, condition) that you choose to share",
          "Your preferred date and time for an inspection",
          "Any other information you voluntarily provide when contacting us",
        ],
      },
    ],
  },
  {
    id: "how-we-use-your-information",
    number: "03",
    title: "How We Use Your Information",
    blocks: [
      {
        type: "p",
        text: "We use the information you provide to:",
      },
      {
        type: "ul",
        items: [
          "Schedule and carry out your free roof inspection",
          "Prepare and send you a quote",
          "Communicate with you about your project (by phone, email, or text)",
          "Send you appointment confirmations and reminders",
          "Keep internal records of our work with you",
          "Improve our services and website",
        ],
      },
    ],
  },
  {
    id: "email-communications",
    number: "04",
    title: "Email Communications",
    blocks: [
      {
        type: "p",
        text: "We send service-related emails (such as inspection confirmations and appointment reminders) through Mailjet, our email service provider.",
      },
      {
        type: "p",
        text: "Every marketing or promotional email we send includes an unsubscribe link. You can also ask us to stop contacting you at any time by emailing us at the address below.",
      },
    ],
  },
  {
    id: "sharing-your-information",
    number: "05",
    title: "Sharing Your Information",
    blocks: [
      {
        type: "p",
        text: "We do not sell or rent your personal information to third parties.",
      },
      {
        type: "p",
        text: "We may share your information with trusted service providers who help us run our business, including:",
      },
      {
        type: "ul",
        items: [
          "Mailjet (email delivery)",
          "Google (calendar scheduling and maps)",
          "Supabase (secure data storage)",
        ],
      },
      {
        type: "p",
        text: "These providers only use your information to help us deliver our services and are not permitted to use it for their own purposes.",
      },
    ],
  },
  {
    id: "advertising-and-cookies",
    number: "06",
    title: "Advertising and Cookies",
    blocks: [
      {
        type: "p",
        text: "If we run advertising campaigns on Meta (Facebook/Instagram) or Google, those platforms may use cookies or similar tracking technology to measure ad performance.",
      },
      {
        type: "p",
        text: "You can control cookie preferences through your browser settings or the ad platform's own privacy tools.",
      },
    ],
  },
  {
    id: "data-retention",
    number: "07",
    title: "Data Retention",
    blocks: [
      {
        type: "p",
        text: "We retain your information for as long as needed to provide our services and to comply with legal, accounting, or reporting requirements.",
      },
    ],
  },
  {
    id: "your-rights",
    number: "08",
    title: "Your Rights",
    blocks: [
      {
        type: "p",
        text: "You may ask us to access, correct, or delete the personal information we hold about you at any time.",
      },
      {
        type: "p",
        text: "To make a request, contact us using the information below.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: "09",
    title: "Children's Privacy",
    blocks: [
      {
        type: "p",
        text: "Our services are not directed at individuals under the age of 18, and we do not knowingly collect personal information from minors.",
      },
    ],
  },
  {
    id: "changes-to-this-policy",
    number: "10",
    title: "Changes to This Policy",
    blocks: [
      {
        type: "p",
        text: 'We may update this Privacy Policy from time to time. The "Effective date" above will reflect the most recent revision.',
      },
    ],
  },
  {
    id: "contact",
    number: "11",
    title: "Contact",
    blocks: [
      {
        type: "contact",
        company: "Revive Roof Solutions Inc.",
        email: "info@reviveroofing.ca",
        phone: "613-701-3088",
        phoneHref: "tel:+16137013088",
        area: "Ottawa, Gatineau & Surrounding Areas",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      headingId="privacy-heading"
      company="Revive Roof Solutions Inc."
      effective="August 17, 2026"
      sections={SECTIONS}
    />
  );
}
