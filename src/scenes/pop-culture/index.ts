import type { Scene } from "../types";
import { wash } from "../helpers";

/**
 * The pop-culture pack: parody tributes restored from the original SignForge
 * themes. The voice and the look (title-bar gradients, accents, window dots)
 * come from the old themes; everything else is new and original.
 *
 * What is deliberately NOT here: show footage, official logos, studio
 * artwork, and the commercial fonts the old themes used. The pictograms are
 * original (`src/lib/pictograms.ts`) and the type is limited to faces we ship
 * under the OFL. These are unofficial tributes and say so in the picker.
 *
 * To ship a build without this pack, delete this folder, remove its import in
 * `src/scenes/index.ts`, and drop `PopSceneId` from `src/scenes/types.ts`.
 */
export const POP_CULTURE_SCENES: Scene[] = [
  {
    id: "office",
    name: "The Office",
    group: "pop-culture",
    icon: "stapler",
    accent: "#8b7355",
    blurb:
      "The Office: paper-company mockumentary energy, an overconfident regional manager, conference-room meetings, deadpan jokes.",
    to: "everyone@dundermifflin.com",
    subject: "Re: Important Business Synergy (NOT a prank)",
    greeting: "That's what she said! ...Wait, I mean, hello!",
    body: [
      "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love this proposal.",
      "I'm not superstitious, but I am a little stitious about this deal. The numbers don't lie, and neither does my World's Best Boss mug. Let's meet in the conference room. I'll bring the Dundies. By Dundies I mean a very professional agenda. Mostly.",
    ],
    closing: "Bears. Beets. Best Regards.",
    bar: {
      light: "linear-gradient(135deg, #f5f0e6 0%, #ebe4d4 50%, #d4cbb8 100%)",
      dark: "linear-gradient(135deg, #2a2520 0%, #1f1c18 50%, #171411 100%)",
    },
    barText: { light: "#5c4d3c", dark: "#e8dcc8" },
    dots: ["#8b7355", "#6b8e23", "#cd853f"],
    stage: wash("139,115,85", 0.22, 0.18),
    fx: "papers",
    fxColors: ["#fffdf5", "#fff9c4", "#f1e9d2", "#e8dcc0", "#c4b8a8"],
  },
  {
    id: "parks",
    name: "Parks & Rec",
    group: "pop-culture",
    icon: "waffle",
    accent: "#daa520",
    blurb:
      "Parks and Recreation: small-town government cheer, an extremely prepared deputy director, binders, waffles, civic pride.",
    to: "parks.dept@pawnee.gov",
    subject: "Re: Official Pawnee Business (URGENT: 5,000 Word Memo Attached)",
    greeting: "Oh my gosh, hi! This is LITERALLY the best email I've ever written!",
    body: [
      "First of all, I have prepared a 47-page binder outlining every detail of this proposal. There are color-coded tabs, laminated dividers, and yes, a section dedicated to waffles. Because waffles are important.",
      "Now, I know what you're thinking: Leslie, isn't this a bit much? And to that I say: there is nothing more beautiful than the bureaucratic process working exactly as intended. Government CAN be fun!",
    ],
    closing: "In government we trust,",
    bar: {
      light: "linear-gradient(135deg, #f5f2ed 0%, #efe9e0 50%, #e8e0d4 100%)",
      dark: "linear-gradient(135deg, #242019 0%, #1c1915 50%, #151210 100%)",
    },
    barText: { light: "#6b4f0f", dark: "#f3deb0" },
    dots: ["#daa520", "#4ade80", "#f59e0b"],
    stage: wash("218,165,32", 0.22, 0.16),
    fx: "leaves",
    fxColors: ["#daa520", "#e0902a", "#c96f33", "#d4a574", "#a89880", "#4ade80"],
  },
  {
    id: "vader",
    name: "Darth Vader",
    group: "pop-culture",
    icon: "saber-hilt",
    accent: "#ef4444",
    blurb:
      "Darth Vader: dark-lord menace, imperial ultimatums, disappointment, a red-lit command deck.",
    to: "imperial.command@galacticempire.gov",
    subject: "Re: Your Destiny Awaits (URGENT)",
    greeting: "I find your lack of response... disturbing.",
    body: [
      "The Emperor has made it quite clear that this project must proceed according to schedule. Your excuses are irrelevant.",
      "I have altered the timeline. Pray I do not alter it further. The deliverables shall be completed by the deadline, or there will be... consequences. Join me, and together we can rule this project as client and vendor. This is your destiny.",
    ],
    closing: "The Force is strong with this signature,",
    bar: {
      light: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
      dark: "linear-gradient(135deg, #0d0d1a 0%, #0a0f1f 50%, #050508 100%)",
    },
    barText: { light: "#fecaca", dark: "#fca5a5" },
    dots: ["#ef4444", "#ef4444", "#ef4444"],
    stage: wash("239,68,68", 0.18, 0.16),
    fx: "scanlines",
    fxColors: ["#ef4444", "#dc2626", "#991b1b", "#450a0a"],
    backdrop: { file: "vader.mp4", poster: "vader.jpg", opacity: 0.2 },
  },
  {
    id: "yoda",
    name: "Yoda",
    group: "pop-culture",
    icon: "sprout",
    accent: "#5a7c4c",
    blurb:
      "Yoda: swamp-wise Jedi master, inverted sentences, calm, fireflies and mist.",
    to: "council@jediorder.org",
    subject: "Re: Discuss this, we must",
    greeting: "Hmmmm, read this email, you will.",
    body: [
      "Much to discuss, we have. Strong in the Force, this proposal is. But patience you must have, young one.",
      "Review the documents, I did. Impressed, I am. A meeting, schedule we should. Available this week, I am. Or available, I am not. There is no maybe.",
    ],
    closing: "May the Force be with you,",
    bar: {
      light: "linear-gradient(135deg, #eef3e8 0%, #e5ede0 50%, #dce6d5 100%)",
      dark: "linear-gradient(135deg, #12231a 0%, #182d20 50%, #1a3525 100%)",
    },
    barText: { light: "#3d5a32", dark: "#cfe8c4" },
    dots: ["#5a7c4c", "#c9a227", "#7a9e6a"],
    stage: wash("90,124,76", 0.24, 0.2),
    fx: "fireflies",
    fxColors: ["#65a30d", "#ca8a04", "#16a34a", "#84cc16"],
    backdrop: { file: "yoda.mp4", poster: "yoda.jpg", opacity: 0.18 },
  },
  {
    id: "spiderman",
    name: "Spider-Man",
    group: "pop-culture",
    icon: "web",
    accent: "#dc2626",
    blurb:
      "Spider-Man: friendly neighborhood web-slinger, breezy quips, great responsibility, late replies.",
    to: "editor@dailybugle.com",
    subject: "Re: Web-slinging into action!",
    greeting: "Hey! Hope you're having a web-tastic day!",
    body: [
      "Sorry for the late reply, I had to stop a few bank robberies and help a cat out of a tree on the way to the coffee shop. You know how it is!",
      "Anyway, I swung by the proposal and wow, with great project scope comes great responsibility, am I right? Let's definitely connect soon. Just don't schedule anything during a full moon. Things get... weird.",
    ],
    closing: "Thwip thwip!",
    bar: {
      light: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #1e40af 100%)",
      dark: "linear-gradient(135deg, #991b1b 0%, #7f1d1d 50%, #1e3a8a 100%)",
    },
    barText: { light: "#ffffff", dark: "#fee2e2" },
    dots: ["#ffffff", "#93c5fd", "#fca5a5"],
    stage: {
      light:
        "radial-gradient(60% 55% at 40% 0%, rgba(220,38,38,0.2), transparent 70%), radial-gradient(45% 45% at 92% 8%, rgba(30,64,175,0.16), transparent 70%)",
      dark:
        "radial-gradient(60% 55% at 40% 0%, rgba(220,38,38,0.16), transparent 70%), radial-gradient(45% 45% at 92% 8%, rgba(59,130,246,0.16), transparent 70%)",
    },
    fx: "web",
    fxColors: ["#dc2626", "#ef4444", "#1e40af", "#3b82f6", "#ffffff"],
    backdrop: { file: "spiderman.mp4", poster: "spiderman.jpg", opacity: 0.2 },
  },
];
