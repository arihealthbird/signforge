import { EmailThemeId } from "./email-themes";

export interface ThemePlaceholders {
  // Personal info
  fullName: string;
  jobTitle: string;
  company: string;
  department: string;
  
  // Contact info
  email: string;
  phone: string;
  mobile: string;
  website: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Social links
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  github: string;
  youtube: string;
  tiktok: string;
  websiteUrl: string;
  
  // Additional
  disclaimer: string;
  calendarLink: string;
  
  // Style panel previews
  previewName: string;
  previewText: string;
  previewSubtitle: string;
  
  // AI Generator
  aiPlaceholder: string;
  aiQuickPrompts: Array<{
    text: string;
    short: string;
  }>;
}

const DEFAULT_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "John Doe",
  jobTitle: "Software Engineer",
  company: "Acme Inc.",
  department: "Engineering",
  email: "john@company.com",
  phone: "+1 (555) 123-4567",
  mobile: "+1 (555) 987-6543",
  website: "https://company.com",
  address: "123 Business Ave",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  linkedin: "https://linkedin.com/in/yourprofile",
  twitter: "https://twitter.com/yourhandle",
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourhandle",
  github: "https://github.com/yourusername",
  youtube: "https://youtube.com/@yourchannel",
  tiktok: "https://tiktok.com/@yourhandle",
  websiteUrl: "https://yourwebsite.com",
  disclaimer: "This email and any attachments are confidential...",
  calendarLink: "https://calendly.com/yourname",
  previewName: "John Doe",
  previewText: "The quick brown fox",
  previewSubtitle: "Software Engineer at Acme Inc.",
  aiPlaceholder: "E.g., 'I'm a software engineer at Google, create a professional signature with my LinkedIn and GitHub links'",
  aiQuickPrompts: [
    { text: "I'm a software engineer at a tech startup - create a modern signature with GitHub and LinkedIn", short: "Tech Startup" },
    { text: "Create a professional corporate signature for a Marketing Director at a Fortune 500 company", short: "Corporate" },
    { text: "Design a creative signature for a freelance designer with portfolio links", short: "Creative" },
    { text: "Generate an executive-style signature for a CEO with elegant styling", short: "Executive" },
    { text: "Create a minimal signature with just name, title and email - clean and professional", short: "Minimal" },
    { text: "I'm a real estate agent - create a warm, trustworthy signature with phone number and calendar link", short: "Real Estate" },
    { text: "Design a signature for a university professor with department info and academic links", short: "Academic" },
    { text: "I'm a doctor at a hospital - create a clean medical signature with credentials and clinic website", short: "Healthcare" },
  ],
};

const OFFICE_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Michael Scott",
  jobTitle: "Regional Manager",
  company: "Dunder Mifflin",
  department: "Sales",
  email: "michael.scott@dundermifflin.com",
  phone: "+1 (570) 555-0100",
  mobile: "+1 (570) 555-0101",
  website: "https://dundermifflin.com",
  address: "1725 Slough Avenue",
  city: "Scranton",
  state: "PA",
  zipCode: "18505",
  linkedin: "https://linkedin.com/in/michaelscott",
  twitter: "https://twitter.com/worldsbestboss",
  facebook: "https://facebook.com/dundermifflin",
  instagram: "https://instagram.com/dundermifflinpaper",
  github: "https://github.com/dundermifflin",
  youtube: "https://youtube.com/@threatlevelmidnight",
  tiktok: "https://tiktok.com/@dundermifflin",
  websiteUrl: "https://dundermifflin.com",
  disclaimer: "Limitless paper in a paperless world. Dunder Mifflin - The People Person's Paper People.",
  calendarLink: "https://calendly.com/michaelscott",
  previewName: "Michael Scott",
  previewText: "That's what she said",
  previewSubtitle: "Regional Manager at Dunder Mifflin",
  aiPlaceholder: "E.g., 'I'm the World's Best Boss at a paper company in Scranton - create a signature that shows my management skills'",
  aiQuickPrompts: [
    { text: "I'm the Regional Manager at a paper company - create a signature worthy of the World's Best Boss", short: "Manager" },
    { text: "Create a professional Dunder Mifflin signature for an office administrator", short: "Admin" },
    { text: "Design a signature for a salesman who's also an Assistant to the Regional Manager", short: "Sales" },
    { text: "Generate a signature for an accountant who loves cats and Angela", short: "Accounting" },
    { text: "Create a minimal signature for someone in HR who just wants to be left alone", short: "HR" },
    { text: "Design a signature for the warehouse foreman who keeps things moving at Dunder Mifflin", short: "Warehouse" },
    { text: "Create a fun signature for someone in the Party Planning Committee", short: "Party Planning" },
    { text: "I'm a temp who somehow became a full-time employee - make a signature that shows my journey", short: "Temp to Hire" },
  ],
};

const PARKS_REC_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Leslie Knope",
  jobTitle: "Deputy Director",
  company: "City of Pawnee",
  department: "Parks and Recreation",
  email: "leslie.knope@pawnee.gov",
  phone: "+1 (765) 555-7282",
  mobile: "+1 (765) 555-7283",
  website: "https://pawneeindiana.gov",
  address: "401 Main Street",
  city: "Pawnee",
  state: "IN",
  zipCode: "46001",
  linkedin: "https://linkedin.com/in/leslieknope",
  twitter: "https://twitter.com/knaborhood",
  facebook: "https://facebook.com/pawneeparks",
  instagram: "https://instagram.com/pawneeparksrec",
  github: "https://github.com/pawneeparks",
  youtube: "https://youtube.com/@paborhood",
  tiktok: "https://tiktok.com/@pawneeparks",
  websiteUrl: "https://pawneeindiana.gov",
  disclaimer: "This message is from the City of Pawnee Parks and Recreation Department. Go Parks!",
  calendarLink: "https://calendly.com/leslieknope",
  previewName: "Leslie Knope",
  previewText: "First in friendship, fourth in obesity",
  previewSubtitle: "Deputy Director at City of Pawnee",
  aiPlaceholder: "E.g., 'I work for the Parks Department in Pawnee, create a warm signature that shows my civic pride and dedication to public service'",
  aiQuickPrompts: [
    { text: "I'm the Deputy Director of Parks and Recreation in Pawnee, Indiana - create a warm government signature with civic pride", short: "Parks Dept" },
    { text: "Create a professional City Hall signature for a government employee who loves their community", short: "City Hall" },
    { text: "Design a creative signature for someone who organizes community events and festivals", short: "Events" },
    { text: "Generate an executive-style signature for a City Manager with elegant civic styling", short: "Manager" },
    { text: "Create a minimal signature for a Parks employee - clean and professional with a touch of warmth", short: "Minimal" },
    { text: "I run the local health department and need a public-service signature that shows I care about the community", short: "Health Dept" },
    { text: "Design a signature for a city auditor who takes budgets very seriously", short: "Auditor" },
    { text: "Create a signature for a public library director who champions literacy and free waffle breakfasts", short: "Library" },
  ],
};

const DARTH_VADER_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Darth Vader",
  jobTitle: "Dark Lord of the Sith",
  company: "Galactic Empire",
  department: "Imperial Command",
  email: "vader@empire.gov",
  phone: "+1 (666) 555-DARK",
  mobile: "+1 (666) 555-SITH",
  website: "https://galacticempire.gov",
  address: "Death Star, Sector 7G",
  city: "Coruscant",
  state: "Core",
  zipCode: "00001",
  linkedin: "https://linkedin.com/in/darthvader",
  twitter: "https://twitter.com/lordvader",
  facebook: "https://facebook.com/galacticempire",
  instagram: "https://instagram.com/darthvader",
  github: "https://github.com/galacticempire",
  youtube: "https://youtube.com/@imperialholonet",
  tiktok: "https://tiktok.com/@galacticempire",
  websiteUrl: "https://galacticempire.gov",
  disclaimer: "This transmission is classified by Imperial decree. The Emperor's will be done.",
  calendarLink: "https://calendly.com/darthvader",
  previewName: "Darth Vader",
  previewText: "I find your lack of faith disturbing",
  previewSubtitle: "Dark Lord at Galactic Empire",
  aiPlaceholder: "E.g., 'I am a commander of the Galactic Empire, create a dark and powerful signature befitting a Sith Lord'",
  aiQuickPrompts: [
    { text: "I am the Dark Lord of the Sith - create a powerful signature that inspires fear across the galaxy", short: "Sith Lord" },
    { text: "Create a signature for an Imperial Officer serving the Galactic Empire", short: "Imperial" },
    { text: "Design a dark signature for someone who has embraced the power of the Dark Side", short: "Dark Side" },
    { text: "Generate a signature for a Star Destroyer commander with military precision", short: "Commander" },
    { text: "Create a minimal but menacing signature worthy of the Empire", short: "Minimal" },
    { text: "I am a bounty hunter working for the Empire - create a signature that means business", short: "Bounty Hunter" },
    { text: "Design a signature for the Grand Moff overseeing the Death Star project", short: "Grand Moff" },
    { text: "Create an intimidating signature for the leader of the Inquisitors hunting Jedi", short: "Inquisitor" },
  ],
};

const YODA_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Master Yoda",
  jobTitle: "Grand Master",
  company: "Jedi Order",
  department: "Jedi Council",
  email: "yoda@jediorder.org",
  phone: "+1 (555) FORCE-1",
  mobile: "+1 (555) WISDOM",
  website: "https://jediorder.org",
  address: "Jedi Temple, Level 1",
  city: "Coruscant",
  state: "Core",
  zipCode: "00001",
  linkedin: "https://linkedin.com/in/masteryoda",
  twitter: "https://twitter.com/yoda",
  facebook: "https://facebook.com/jediorder",
  instagram: "https://instagram.com/masteryoda",
  github: "https://github.com/jediorder",
  youtube: "https://youtube.com/@jediarchives",
  tiktok: "https://tiktok.com/@jediorder",
  websiteUrl: "https://jediorder.org",
  disclaimer: "Strong in the Force, this message is. Read carefully, you must.",
  calendarLink: "https://calendly.com/masteryoda",
  previewName: "Master Yoda",
  previewText: "Do or do not, there is no try",
  previewSubtitle: "Grand Master at Jedi Order",
  aiPlaceholder: "E.g., 'A Jedi Master I am, wise and powerful signature create for me, you will'",
  aiQuickPrompts: [
    { text: "A Jedi Grand Master I am - create a wise and serene signature, you will", short: "Jedi Master" },
    { text: "Create a signature for a Jedi Knight strong in the ways of the Force", short: "Knight" },
    { text: "Design a peaceful signature for one who teaches the ways of the Force", short: "Teacher" },
    { text: "Generate a signature for a member of the Jedi Council with ancient wisdom", short: "Council" },
    { text: "Minimal signature create for a humble Jedi, you must", short: "Minimal" },
    { text: "A Padawan learner I am, eager to prove myself - create a signature showing my path to knighthood", short: "Padawan" },
    { text: "Keeper of the Jedi Archives I am - design a scholarly signature of great knowledge", short: "Archivist" },
    { text: "A healer in the Jedi Temple, create a calming signature that soothes the spirit, you will", short: "Healer" },
  ],
};

const SPIDERMAN_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Peter Parker",
  jobTitle: "Photographer / Hero",
  company: "Daily Bugle",
  department: "Photography",
  email: "peter.parker@dailybugle.com",
  phone: "+1 (212) 555-WEBS",
  mobile: "+1 (212) 555-SPDR",
  website: "https://dailybugle.com",
  address: "20 Ingram Street",
  city: "Queens",
  state: "NY",
  zipCode: "11375",
  linkedin: "https://linkedin.com/in/peterparker",
  twitter: "https://twitter.com/spikiepete",
  facebook: "https://facebook.com/dailybugle",
  instagram: "https://instagram.com/spideyshots",
  github: "https://github.com/webslinger",
  youtube: "https://youtube.com/@dailybugle",
  tiktok: "https://tiktok.com/@spideyshots",
  websiteUrl: "https://dailybugle.com",
  disclaimer: "With great power comes great responsibility. Also, I'm not Spider-Man. Stop asking.",
  calendarLink: "https://calendly.com/peterparker",
  previewName: "Peter Parker",
  previewText: "With great power...",
  previewSubtitle: "Photographer at Daily Bugle",
  aiPlaceholder: "E.g., 'I'm a freelance photographer who's definitely NOT Spider-Man - create a web-tastic signature!'",
  aiQuickPrompts: [
    { text: "I'm your friendly neighborhood photographer - create an amazing signature with web appeal!", short: "Hero" },
    { text: "Create a signature for a freelance photographer at a New York newspaper", short: "Photographer" },
    { text: "Design a fun signature for someone who swings between jobs", short: "Freelancer" },
    { text: "Generate a signature that's spectacular and sensational", short: "Spectacular" },
    { text: "Create a simple signature for a busy Queens teenager", short: "Minimal" },
    { text: "I'm a science student who also interns at a cutting-edge tech lab - create a brainy signature", short: "Science Whiz" },
    { text: "Design a signature for someone who runs a social media account covering NYC street photography", short: "Influencer" },
    { text: "Create a heroic signature for the editor-in-chief who demands pictures of Spider-Man", short: "Editor" },
  ],
};

const PIRATE_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Captain Jack Sparrow",
  jobTitle: "Captain",
  company: "The Black Pearl",
  department: "Piracy & Plunder",
  email: "captain@blackpearl.sea",
  phone: "+1 (SEA) RUM-GONE",
  mobile: "+1 (SEA) YO-HO-HO",
  website: "https://blackpearl.sea",
  address: "Shipwreck Cove, Dock 7",
  city: "Tortuga",
  state: "Caribbean",
  zipCode: "00000",
  linkedin: "https://linkedin.com/in/captainjack",
  twitter: "https://twitter.com/captainjack",
  facebook: "https://facebook.com/blackpearl",
  instagram: "https://instagram.com/captainjacksparrow",
  github: "https://github.com/blackpearl",
  youtube: "https://youtube.com/@pirateslife",
  tiktok: "https://tiktok.com/@pirateslife",
  websiteUrl: "https://blackpearl.sea",
  disclaimer: "This message may contain rum stains. The Black Pearl claims no responsibility for lost treasure.",
  calendarLink: "https://calendly.com/captainjack",
  previewName: "Captain Jack Sparrow",
  previewText: "Why is the rum always gone?",
  previewSubtitle: "Captain at The Black Pearl",
  aiPlaceholder: "E.g., 'Arr, I be a captain of the seven seas - create a signature worthy of a pirate legend, savvy?'",
  aiQuickPrompts: [
    { text: "Arr, I be the Captain of the Black Pearl - create a signature worthy of a pirate legend!", short: "Captain" },
    { text: "Create a signature for a sea-faring buccaneer who loves rum and adventure", short: "Pirate" },
    { text: "Design a treasure map style signature for a swashbuckling entrepreneur", short: "Treasure" },
    { text: "Generate a signature for the most infamous pirate in the Caribbean", short: "Infamous" },
    { text: "Create a simple signature, savvy? Nothing too fancy, mate", short: "Minimal" },
    { text: "I be the ship's navigator charting courses through uncharted waters - create a signature with adventure", short: "Navigator" },
    { text: "Design a signature for the quartermaster who keeps the crew in line and the loot organized", short: "Quartermaster" },
    { text: "Arr, I run a tavern in Tortuga - create a welcoming signature for weary sailors", short: "Tavern Keep" },
  ],
};

const SHAKESPEARE_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "William Shakespeare",
  jobTitle: "Playwright & Poet",
  company: "The Globe Theatre",
  department: "Drama & Verse",
  email: "bard@globetheatre.uk",
  phone: "+44 (0) 1564-BARD",
  mobile: "+44 (0) 1564-QUILL",
  website: "https://globetheatre.uk",
  address: "21 Maiden Lane",
  city: "Stratford-upon-Avon",
  state: "Warwickshire",
  zipCode: "CV37 6BA",
  linkedin: "https://linkedin.com/in/thebard",
  twitter: "https://twitter.com/shakespeare",
  facebook: "https://facebook.com/globetheatre",
  instagram: "https://instagram.com/bardofavon",
  github: "https://github.com/thebard",
  youtube: "https://youtube.com/@globetheatre",
  tiktok: "https://tiktok.com/@thebard",
  websiteUrl: "https://globetheatre.uk",
  disclaimer: "All the world's a stage, and all correspondence merely players upon it.",
  calendarLink: "https://calendly.com/shakespeare",
  previewName: "William Shakespeare",
  previewText: "To be, or not to be",
  previewSubtitle: "Playwright at The Globe Theatre",
  aiPlaceholder: "E.g., 'I am a playwright most renowned - prithee, craft for me a signature of great eloquence!'",
  aiQuickPrompts: [
    { text: "I am the Bard of Avon - create a signature most eloquent and theatrical!", short: "Bard" },
    { text: "Create a signature fit for a playwright at The Globe Theatre", short: "Playwright" },
    { text: "Design a poetic signature worthy of the greatest writer in the English tongue", short: "Poet" },
    { text: "Generate a dramatic signature befitting a master of tragedy and comedy", short: "Drama" },
    { text: "Create a humble signature for a simple wordsmith of Stratford", short: "Minimal" },
    { text: "I am a travelling actor performing the Bard's works across the land - create a signature of flair", short: "Actor" },
    { text: "Design a signature for a scholar who studies and annotates the great works of literature", short: "Scholar" },
    { text: "Prithee, craft a signature for a royal court musician who composes for kings and queens", short: "Musician" },
  ],
};

const SURFER_PLACEHOLDERS: ThemePlaceholders = {
  fullName: "Chad Waverson",
  jobTitle: "Pro Surfer / Instructor",
  company: "Gnarly Waves Surf Co.",
  department: "Wave Riding",
  email: "chad@gnarlywaves.com",
  phone: "+1 (808) 555-WAVE",
  mobile: "+1 (808) 555-SURF",
  website: "https://gnarlywaves.com",
  address: "420 Beach Blvd",
  city: "Malibu",
  state: "CA",
  zipCode: "90265",
  linkedin: "https://linkedin.com/in/chadwaverson",
  twitter: "https://twitter.com/gnarlychad",
  facebook: "https://facebook.com/gnarlywaves",
  instagram: "https://instagram.com/chadwaverson",
  github: "https://github.com/surfcode",
  youtube: "https://youtube.com/@gnarlywaves",
  tiktok: "https://tiktok.com/@gnarlychad",
  websiteUrl: "https://gnarlywaves.com",
  disclaimer: "Hang loose! 🤙 This message was typed between sets. Mahalo for your patience, brah!",
  calendarLink: "https://calendly.com/chadwaverson",
  previewName: "Chad Waverson",
  previewText: "Life's a beach, dude! 🏄",
  previewSubtitle: "Pro Surfer at Gnarly Waves",
  aiPlaceholder: "E.g., 'Duuude, I'm a pro surfer - create a totally tubular signature that captures the stoke!'",
  aiQuickPrompts: [
    { text: "Duuude, I'm a pro surfer - create a totally tubular signature that captures the stoke!", short: "Pro Surfer" },
    { text: "Create a chill signature for a surf instructor who lives for the waves", short: "Instructor" },
    { text: "Design a beachy signature with major coastal vibes", short: "Beach Vibes" },
    { text: "Generate a signature for someone who's stoked about life and waves", short: "Stoked" },
    { text: "Create a simple signature, brah - nothing too gnarly", short: "Minimal" },
    { text: "I run a beachside surf shop selling boards and wax - create a laid-back business signature", short: "Surf Shop" },
    { text: "Design a signature for a marine biologist who surfs between research dives", short: "Ocean Science" },
    { text: "Brah, I'm a yoga instructor on the beach - create a zen signature with tropical energy", short: "Beach Yoga" },
  ],
};

// Map of theme IDs to their placeholder configurations
const THEME_PLACEHOLDERS: Record<EmailThemeId, ThemePlaceholders> = {
  "professional": DEFAULT_PLACEHOLDERS,
  "the-office": OFFICE_PLACEHOLDERS,
  "parks-and-recreation": PARKS_REC_PLACEHOLDERS,
  "darth-vader": DARTH_VADER_PLACEHOLDERS,
  "yoda": YODA_PLACEHOLDERS,
  "spider-man": SPIDERMAN_PLACEHOLDERS,
  "pirate": PIRATE_PLACEHOLDERS,
  "shakespeare": SHAKESPEARE_PLACEHOLDERS,
  "surfer-dude": SURFER_PLACEHOLDERS,
};

/**
 * Get the placeholder configuration for a specific email theme
 */
export function getThemePlaceholders(themeId: EmailThemeId): ThemePlaceholders {
  return THEME_PLACEHOLDERS[themeId] || DEFAULT_PLACEHOLDERS;
}

/**
 * Get the default placeholders (used when no theme is specified)
 */
export function getDefaultPlaceholders(): ThemePlaceholders {
  return DEFAULT_PLACEHOLDERS;
}
