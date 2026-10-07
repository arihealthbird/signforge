import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { SITE, THEOVEX } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const SECTIONS: LegalSection[] = [
  {
    title: "Overview",
    body: [
      `${SITE.name} is a free, open-source email signature builder from ${THEOVEX.name}. We keep data collection to a minimum: your signature lives in your browser, and there are no accounts.`,
    ],
  },
  {
    title: "What you type",
    body: [
      "Your name, job title, contact details, links and image URLs stay in your browser. They are not stored on our servers. The only time anything leaves your browser is when you use one of the features described below.",
      "To let you pick up where you left off, we save your latest signature draft and your light or dark theme choice in your browser's local storage. Clear your site data at any time to remove them.",
    ],
  },
  {
    title: "AI generation",
    body: [
      "When you ask the AI to design or change a signature, the text of your request, the recent messages in the conversation and the signature you are editing are sent from our server to Theo, the AI orchestration API at hitheo.ai. Theo routes the request to a model and returns the result. We do not store these requests.",
      "Theo handles that data under its own documentation and policies. It does not use prompts or responses to train models, and it may keep request audit logs and short-lived cache entries. It passes the request to the model provider it selects to produce the answer. Details: https://docs.hitheo.ai/security/data-privacy.",
      "To protect the service from abuse we keep your IP address in memory for a short time to rate-limit requests. It is not written to a database.",
      "If you self-host SignForge, you supply your own Theo API key through an environment variable. The key stays on your server and is never sent to the browser.",
    ],
  },
  {
    title: "GIFs (GIPHY)",
    body: [
      "If you open the GIF picker, your browser contacts GIPHY directly. GIPHY receives your search terms and your IP address, and serves the GIFs you see. GIPHY's privacy policy applies to that exchange.",
      "A GIF you add to your signature is loaded from GIPHY's servers by whoever opens an email that contains it. That means GIPHY can see those requests.",
    ],
  },
  {
    title: "Fonts",
    body: [
      "Every typeface on this site is served from this site. Loading a page does not send a font request to any third party, so no font provider receives your IP address.",
    ],
  },
  {
    title: "What we do not do",
    body: [
      "We do not build user profiles or advertising audiences, we do not use tracking cookies, and we do not sell data. The optional \u201CMade with SignForge\u201D line in an exported signature contains two plain links and no tracking parameters.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about this policy are welcome. Open an issue on ${SITE.repoUrl} or reach ${THEOVEX.name} through ${THEOVEX.url}.`,
    ],
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="October 2026" sections={SECTIONS} />;
}
