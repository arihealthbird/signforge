export type EmailThemeId = 
  | "professional"
  | "darth-vader"
  | "yoda"
  | "spider-man"
  | "pirate"
  | "shakespeare"
  | "surfer-dude"
  | "the-office"
  | "parks-and-recreation";

export interface EmailTheme {
  id: EmailThemeId;
  name: string;
  icon: string;
  character?: string;
  greeting: string;
  body: string[];
  closing: string;
  subject: string;
  // Visual styling
  headerBg?: {
    light: string;
    dark: string;
  };
  accentColor?: string;
  borderStyle?: string;
  windowButtons?: {
    colors: [string, string, string];
  };
  fontStyle?: string;
  specialEffects?: string;
}

export const EMAIL_THEMES: EmailTheme[] = [
  {
    id: "professional",
    name: "Professional",
    icon: "PRO",
    greeting: "Hi there,",
    body: [
      "Thank you for reaching out! I wanted to follow up on our conversation from earlier this week.",
      "I've had a chance to review the proposal and I think there are some great opportunities for us to collaborate.",
      "Let me know if you're available for a quick call this week to discuss next steps.",
    ],
    closing: "Best regards,",
    subject: "Re: Quick follow up",
  },
  {
    id: "darth-vader",
    name: "Darth Vader",
    icon: "SITH",
    character: "The Dark Lord of the Sith",
    greeting: "I find your lack of response... disturbing.",
    body: [
      "The Emperor has made it quite clear that this project must proceed according to schedule. Your excuses are irrelevant.",
      "I have altered the timeline. Pray I do not alter it further. The deliverables shall be completed by the deadline, or there will be... consequences.",
      "Join me, and together we can rule this project as client and vendor. This is your destiny.",
    ],
    closing: "The Force is strong with this signature,",
    subject: "Re: Your Destiny Awaits (URGENT)",
    headerBg: {
      light: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
      dark: "linear-gradient(135deg, #0d0d1a 0%, #0a0f1f 50%, #050508 100%)",
    },
    accentColor: "#ef4444",
    windowButtons: {
      colors: ["#ef4444", "#ef4444", "#ef4444"],
    },
    specialEffects: "vader",
  },
  {
    id: "yoda",
    name: "Yoda",
    icon: "JEDI",
    character: "Jedi Grand Master",
    greeting: "Hmmmm, read this email, you will.",
    body: [
      "Much to discuss, we have. Strong in the Force, this proposal is. But patience you must have, young one.",
      "Review the documents, I did. Impressed, I am. But careful you must be. The path to success, clouded it is. Many attachments, I sense in you.",
      "A meeting, schedule we should. Available this week, I am. Or available, I am not. There is no maybe.",
    ],
    closing: "May the Force be with you,",
    subject: "Re: Discuss this, we must",
    headerBg: {
      light: "linear-gradient(135deg, #eef3e8 0%, #e5ede0 50%, #dce6d5 100%)",
      dark: "linear-gradient(135deg, #12231a 0%, #182d20 50%, #1a3525 100%)",
    },
    accentColor: "#5a7c4c",
    windowButtons: {
      colors: ["#5a7c4c", "#c9a227", "#7a9e6a"],
    },
    specialEffects: "yoda",
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    icon: "WEB",
    character: "Your Friendly Neighborhood Web-Slinger",
    greeting: "Hey! Hope you're having a web-tastic day!",
    body: [
      "Sorry for the late reply – had to stop a few bank robberies and help a cat out of a tree on the way to the coffee shop. You know how it is! ☕🕸️",
      "Anyway, I swung by the proposal and WOW – with great project scope comes great responsibility, am I right? I think we can really make this work!",
      "Let's definitely connect soon! I'm pretty flexible (like, literally, I can bend in ways you wouldn't believe 🤸). Just don't schedule anything when there's a full moon – things get... weird.",
    ],
    closing: "Thwip thwip! 🕸️",
    subject: "Re: Web-slinging into action!",
    headerBg: {
      light: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #1e40af 100%)",
      dark: "linear-gradient(135deg, #991b1b 0%, #7f1d1d 50%, #1e3a8a 100%)",
    },
    accentColor: "#dc2626",
    windowButtons: {
      colors: ["#dc2626", "#1e40af", "#dc2626"],
    },
    specialEffects: "spidey",
  },
  {
    id: "pirate",
    name: "Captain Jack",
    icon: "ARR",
    character: "Captain of the Black Pearl",
    greeting: "Ahoy there, landlubber!",
    body: [
      "Arr, I be receivin' yer message in a bottle! Or was it electronic mail? These newfangled contraptions confuse me addled brain, savvy?",
      "I've consulted me compass (it don't point north, but it DO point to what I want most – and right now, that be closin' this deal! 🧭). Yer proposal be worth its weight in doubloons!",
      "Let's parley over some grog this week, shall we? I promise not to commandeer yer ship... probably. Unless it be a really nice ship. 🏴‍☠️",
    ],
    closing: "Fair winds and following seas,",
    subject: "Re: X Marks the Spot (Contract Inside) ☠️",
    headerBg: {
      light: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #451a03 100%)",
      dark: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #292524 100%)",
    },
    accentColor: "#f59e0b",
    windowButtons: {
      colors: ["#f59e0b", "#78350f", "#f59e0b"],
    },
    specialEffects: "pirate",
  },
  {
    id: "shakespeare",
    name: "Shakespeare",
    icon: "BARD",
    character: "The Bard of Avon",
    greeting: "Hark! What light through yonder inbox breaks?",
    body: [
      "Tis I, responding to thy most eloquent electronic missive! To reply, or not to reply – that was never the question, for thy message compelled mine hand to action forthwith.",
      "I have perused thy proposal with mine own eyes, and verily, it doth possess great merit! Though the timeline be ambitious, together we shall make it so – for what's past is prologue, and our future partnership shall be the stuff of legends! 📜",
      "Prithee, let us arrange a meeting of minds. Would that we could converse o'er mead, but a video call shall suffice in these modern times. All the world's a stage, and this project merely our next act!",
    ],
    closing: "With quill in hand and good intentions,",
    subject: "Re: A Partnership Most Excellent! 🎭",
    headerBg: {
      light: "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #4c1d95 100%)",
      dark: "linear-gradient(135deg, #3b0764 0%, #581c87 50%, #1e1b4b 100%)",
    },
    accentColor: "#a855f7",
    windowButtons: {
      colors: ["#a855f7", "#f59e0b", "#a855f7"],
    },
    specialEffects: "shakespeare",
  },
  {
    id: "surfer-dude",
    name: "Surfer Dude",
    icon: "SURF",
    character: "Aloha from Hawaii 🌺",
    greeting: "Duuuude! Aloha! 🤙🌺",
    body: [
      "Bro, I totally caught your message between sets! The waves were absolutely GNARLY today at Pipeline – like 8-footers, brah! But business is business, ya know? Gotta ride both kinds of waves! 🌊🏄‍♂️",
      "So like, I checked out your proposal and it's totally tubular! The numbers are looking more stacked than the barrels at Sunset Beach. I'm super stoked to collab on this, for real! This could be as epic as a North Shore winter swell!",
      "Let's def sync up this week – maybe a call while I'm waiting for the next set? I'm usually at the beach by sunrise, so anytime after my morning session is chill. We can talk story over some açaí bowls! Mahalo nui loa! 🤙🌺🌴",
    ],
    closing: "Hang loose and stay stoked,",
    subject: "Re: Gnarly Business Opportunity! 🏄‍♂️🌺",
    headerBg: {
      light: "linear-gradient(135deg, #0d9488 0%, #06b6d4 30%, #0ea5e9 50%, #f97316 80%, #ec4899 100%)",
      dark: "linear-gradient(135deg, #134e4a 0%, #0e7490 30%, #0369a1 50%, #c2410c 80%, #be185d 100%)",
    },
    accentColor: "#06b6d4",
    windowButtons: {
      colors: ["#ec4899", "#fbbf24", "#06b6d4"],
    },
    fontStyle: "tropical",
    specialEffects: "surfer",
  },
  {
    id: "the-office",
    name: "The Office",
    icon: "DM",
    character: "World's Best Boss",
    greeting: "That's what she said! ...Wait, I mean, Hello!",
    body: [
      "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love this proposal. 📎",
      "I'm not superstitious, but I am a little stitious about this deal. The numbers don't lie – and neither does my World's Best Boss mug. This is going to be HUGE.",
      "Let's schedule a meeting in the conference room. I'll bring the Dundies! And by Dundies, I mean a very professional agenda. Mostly. Maybe some Dundies. 🏆",
    ],
    closing: "Bears. Beets. Best Regards.",
    subject: "Re: Important Business Synergy (NOT a prank)",
    headerBg: {
      light: "linear-gradient(135deg, #f5f0e6 0%, #ebe4d4 50%, #d4cbb8 100%)",
      dark: "linear-gradient(135deg, #2a2520 0%, #1f1c18 50%, #171411 100%)",
    },
    accentColor: "#5c4d3c",
    windowButtons: {
      colors: ["#8b7355", "#6b8e23", "#cd853f"],
    },
    specialEffects: "office",
  },
  {
    id: "parks-and-recreation",
    name: "Parks & Rec",
    icon: "🌳",
    character: "Deputy Director of Parks & Recreation",
    greeting: "Oh my gosh, hi! This is LITERALLY the best email I've ever written!",
    body: [
      "First of all, I want you to know that I have prepared a 47-page binder outlining every single detail of this proposal. There are color-coded tabs, laminated dividers, and YES, there's a section dedicated to waffles. Because waffles are important. 🧇",
      "Now, I know what you're thinking: 'Leslie, isn't this a bit much?' And to that I say: There's nothing more beautiful than the bureaucratic process working exactly as intended! Government CAN be fun! Also, I've already named this project and made it a commemorative plaque.",
      "P.S. - If you need me, I'll be at JJ's Diner stress-eating waffles or visiting Li'l Sebastian's memorial. RIP you majestic miniature beast. 🐴💫",
    ],
    closing: "In government we trust,",
    subject: "Re: Official Pawnee Business (URGENT - 5,000 Word Memo Attached)",
    headerBg: {
      light: "linear-gradient(135deg, #f5f2ed 0%, #efe9e0 50%, #e8e0d4 100%)",
      dark: "linear-gradient(135deg, #242019 0%, #1c1915 50%, #151210 100%)",
    },
    accentColor: "#daa520",
    windowButtons: {
      colors: ["#daa520", "#4ade80", "#f59e0b"],
    },
    specialEffects: "parks",
  },
];

export function getEmailTheme(id: EmailThemeId): EmailTheme {
  return EMAIL_THEMES.find((theme) => theme.id === id) || EMAIL_THEMES[0];
}
