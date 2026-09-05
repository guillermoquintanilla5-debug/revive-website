import type { Metadata } from "next";
import LegalDocument, {
  type LegalSection,
} from "../components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service | Revive Roof Solutions",
  description:
    "Read the Terms of Service governing the use of the Revive Roof Solutions website and service requests.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance-of-terms",
    number: "01",
    title: "Acceptance of Terms",
    blocks: [
      {
        type: "p",
        text: 'By using this website or requesting a free roof assessment from Revive Roof Solutions Inc. ("Revive," "we," "us," or "our"), you agree to these Terms of Service.',
      },
    ],
  },
  {
    id: "our-services",
    number: "02",
    title: "Our Services",
    blocks: [
      {
        type: "p",
        text: "Revive provides roof rejuvenation, roof inspection, and minor roof repair services to residential properties in the Ottawa, Ontario area.",
      },
      {
        type: "p",
        text: "Submitting a request through our website does not create a binding contract. It simply requests a free, no-obligation roof inspection.",
      },
    ],
  },
  {
    id: "quotes",
    number: "03",
    title: "Quotes",
    blocks: [
      {
        type: "p",
        text: "Any quote provided after an inspection is an estimate based on the condition of your roof at the time of inspection.",
      },
      {
        type: "p",
        text: "Quotes are valid for the period stated on the quote document and are not binding until both parties agree to a signed work order or invoice.",
      },
    ],
  },
  {
    id: "scheduling-and-cancellations",
    number: "04",
    title: "Scheduling and Cancellations",
    blocks: [
      {
        type: "p",
        text: "We do our best to accommodate your preferred inspection date and time.",
      },
      {
        type: "p",
        text: "If you need to reschedule or cancel, please contact us as soon as possible so we can offer that slot to another customer.",
      },
    ],
  },
  {
    id: "payment",
    number: "05",
    title: "Payment",
    blocks: [
      {
        type: "p",
        text: "Payment terms for any completed work will be outlined in your invoice.",
      },
      {
        type: "p",
        text: "Specific payment methods, deposit requirements, and due dates will be communicated directly at the time of booking.",
      },
    ],
  },
  {
    id: "warranty",
    number: "06",
    title: "Warranty",
    blocks: [
      {
        type: "p",
        text: "Workmanship and material warranties, where applicable, will be provided separately in writing for each completed job and are not governed by this general Terms of Service page.",
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "07",
    title: "Intellectual Property",
    blocks: [
      {
        type: "p",
        text: "All content on this website, including text, images, graphics, branding, and the Revive Roof Solutions logo, is the property of Revive Roof Solutions Inc. unless otherwise stated and may not be reproduced without permission.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    number: "08",
    title: "Limitation of Liability",
    blocks: [
      {
        type: "p",
        text: "Revive is not liable for indirect, incidental, or consequential damages arising from the use of this website.",
      },
      {
        type: "p",
        text: "Our liability for any service performed is limited to the terms outlined in the applicable signed work order.",
      },
    ],
  },
  {
    id: "governing-law",
    number: "09",
    title: "Governing Law",
    blocks: [
      {
        type: "p",
        text: "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.",
      },
    ],
  },
  {
    id: "changes-to-these-terms",
    number: "10",
    title: "Changes to These Terms",
    blocks: [
      {
        type: "p",
        text: 'We may update these Terms from time to time. The "Effective date" above will reflect the most recent revision.',
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
      },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      title="Terms of Service"
      headingId="terms-heading"
      company="Revive Roof Solutions Inc."
      effective="August 17, 2026"
      sections={SECTIONS}
    />
  );
}
