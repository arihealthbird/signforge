import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { SITE, THEOVEX } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
};

const SECTIONS: LegalSection[] = [
  {
    title: "Acceptance",
    body: [
      `By using ${SITE.name} (the "Service"), a free and open-source project from ${THEOVEX.name}, you agree to these terms. If you don't agree, please don't use the Service.`,
    ],
  },
  {
    title: "Free and open source",
    body: [
      `${SITE.name} is provided free of charge under the ${SITE.license} license. You may use, modify and self-host the software, provided you keep the required notices when you redistribute it.`,
      `The ${THEOVEX.name} name and logo are trademarks of ${THEOVEX.name}. The ${SITE.license} license does not grant permission to use them.`,
    ],
  },
  {
    title: "Your responsibilities",
    body: [
      "You are responsible for the content you enter and the signatures you create. Don't use SignForge to impersonate others, create misleading or fraudulent signatures, or break the law.",
    ],
  },
  {
    title: "AI-generated content",
    body: [
      "AI features generate content with Theo, an AI orchestration API that routes each request to a third-party model. Output can be inaccurate, including made-up contact details and links. You are responsible for reviewing everything you export or share.",
    ],
  },
  {
    title: "Third-party content",
    body: [
      "GIFs come from GIPHY and remain subject to GIPHY's terms. Images and links you add are yours to be responsible for. Make sure you have the right to use them.",
    ],
  },
  {
    title: "Email client compatibility",
    body: [
      "Signatures can render differently across email clients such as Gmail, Outlook and Apple Mail. Animated GIFs show only their first frame in some versions of Outlook. Test your signature before relying on it in important communications.",
    ],
  },
  {
    title: "No warranty",
    body: [
      'THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${THEOVEX.name.toUpperCase()} AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.`,
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about these terms are welcome. Open an issue on ${SITE.repoUrl} or reach ${THEOVEX.name} through ${THEOVEX.url}.`,
    ],
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Use" updated="October 2026" sections={SECTIONS} />;
}
