import type { Metadata, Viewport } from "next";

// UI face (Geist, up to weight 800 for display type), the mono face, and the
// pixel face for the `forge` and `theo` tokens. All self-hosted via
// @fontsource, so nothing is fetched from Google or anyone else at build or
// run time.
import "@fontsource-variable/geist";
import "@fontsource/geist-mono/latin-400.css";
import "@fontsource/geist-mono/latin-500.css";
import "@fontsource/pixelify-sans/latin-700.css";

// Scene faces (SIL OFL). Only the scene's greeting and subject lines use them,
// and the browser downloads a file only once a scene that needs it is on screen.
import "@fontsource/pirata-one/latin-400.css";
import "@fontsource/im-fell-english/latin-400.css";
import "@fontsource/pacifico/latin-400.css";

// Signature fonts. These only drive the on-screen preview (email clients can't
// load web fonts), so we ship the latin subset only. Each family is exposed as
// a --font-* variable in globals.css, consumed by src/types/signature.ts.
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/open-sans/latin-400.css";
import "@fontsource/open-sans/latin-500.css";
import "@fontsource/open-sans/latin-600.css";
import "@fontsource/open-sans/latin-700.css";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/outfit/latin-400.css";
import "@fontsource/outfit/latin-500.css";
import "@fontsource/outfit/latin-600.css";
import "@fontsource/outfit/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-500.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/merriweather/latin-400.css";
import "@fontsource/merriweather/latin-700.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/lora/latin-600.css";
import "@fontsource/lora/latin-700.css";

import "./globals.css";
import { PageBackground } from "@/components/page-background";
import { SITE, THEOVEX } from "@/lib/site";

// Apply the saved theme before hydration to avoid a flash of the wrong theme.
const themeInitScript = `try{var t=localStorage.getItem('sf-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

const title = `${SITE.name} | AI email signature builder by ${THEOVEX.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "email signature",
    "signature generator",
    "AI",
    "Gmail",
    "Outlook",
    "open source",
    "TheoVex",
  ],
  authors: [{ name: THEOVEX.name, url: THEOVEX.url }],
  creator: THEOVEX.name,
  openGraph: {
    title,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c11" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <PageBackground />
        {children}
      </body>
    </html>
  );
}
