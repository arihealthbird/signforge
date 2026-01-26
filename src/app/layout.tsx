import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Source_Sans_3,
  Nunito,
  Playfair_Display,
  Merriweather,
  Lora,
  Source_Serif_4,
  Raleway,
  Work_Sans,
  DM_Sans,
  Outfit,
  Plus_Jakarta_Sans,
  Manrope,
  Space_Grotesk,
  Sora,
  Lexend,
  Onest,
  IM_Fell_English,
  Pirata_One,
  Pacifico,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Sans-serif fonts
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

// Serif fonts
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

// Display fonts
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

// Shakespeare theme font
const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell-english",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Captain Jack pirate theme font
const pirataOne = Pirata_One({
  variable: "--font-pirata-one",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Surfer Dude Hawaiian theme font
const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fontVariables = [
  inter.variable,
  jetbrainsMono.variable,
  roboto.variable,
  openSans.variable,
  lato.variable,
  montserrat.variable,
  poppins.variable,
  sourceSans.variable,
  nunito.variable,
  dmSans.variable,
  outfit.variable,
  plusJakarta.variable,
  manrope.variable,
  spaceGrotesk.variable,
  sora.variable,
  lexend.variable,
  onest.variable,
  playfair.variable,
  merriweather.variable,
  lora.variable,
  sourceSerif.variable,
  raleway.variable,
  workSans.variable,
  imFellEnglish.variable,
  pirataOne.variable,
  pacifico.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Signature Forge | AI-Powered Email Signature Builder",
  description: "Create stunning, professional email signatures with AI assistance. Free, unlimited, no sign-up required. Export for Gmail, Outlook, and more.",
  keywords: ["email signature", "signature builder", "AI", "Gmail", "Outlook", "free"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,700,900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${fontVariables} font-sans antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
