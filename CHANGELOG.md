# Changelog

All notable changes to SignForge are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Open-source project documentation: `docs/` (architecture, API, self-hosting,
  forking and rebranding), a Code of Conduct, governance notes, a Developer
  Certificate of Origin with a CI sign-off check, Dependabot, CodeQL and Docker
  support. `SECURITY.md` gains supported versions, a response timeline and safe
  harbor.
- `src/lib/theo.ts`, a small tested client for the Theo API. It always uses the
  www host, sends the key only over https, and reports failures with Theo's
  request id.
- The TheoVex house skin: a warm paper canvas with a soft wash and fine grain,
  squared corners across the shell, 2px ink borders and hard offset shadows,
  Geist 800 display type, Geist Mono numbered eyebrows (`02 · HOW IT WORKS`),
  and a Pixelify Sans `forge` wordmark. Neon `#D4FF00` stays as SignForge's
  product accent, used for active-state shadows, status dots and highlights.
- A flat sticky header with squared chips, a ruled index strip under the hero,
  flat feature cards with accent top borders and tinted icon tiles, a dark
  "Build on theo." band, and a footer that is a liquid-glass card over a pixel
  forest (the static `ForestStill`, ported from theovex.com) with the TheoVex
  wordmark.
- An icon system (`src/components/icons.tsx`): Lucide through one semantic
  registry with a fixed stroke and size scale, `IconTile` for tinted tiles, and
  five original pictograms (stapler, waffle, web, saber hilt, fedora) for what
  Lucide does not draw. Unit tests and a source scan keep emoji out.
- A scene registry (`src/scenes`) with a core pack (classic, pirate, bard, surf,
  noir, cosmic) and a removable pop-culture pack of five unofficial tributes
  restored from the original themes: The Office, Parks & Rec, Darth Vader, Yoda
  and Spider-Man. Each scene has an icon, an accent, a group, and an optional
  font and backdrop.
- Five new canvas effects: papers, leaves and pollen, fireflies and mist, web
  lines, and hologram scanlines. The engine now pauses when it is scrolled out
  of view.
- A grouped scene picker (Everyday, Adventure, Pop culture) with icon tiles,
  keyboard navigation, and an "unofficial tribute" note.
- Optional scene backdrop videos, loaded from `NEXT_PUBLIC_SCENE_MEDIA_BASE`
  only when it is set. No media ships with the repo.
- OFL scene faces for the greeting and subject lines: Pirata One, IM Fell
  English and Pacifico.
- A studio workspace with Chat, Design, Details and Extras tabs, live template
  thumbnails, a visual font grid, and a light/dark and phone-width preview.
- TheoVex branding: "A TheoVex project" chip, header chip in the studio, the
  footer, and an optional "Made with SignForge, a TheoVex project" line in
  exports.
- GIPHY GIF picker (REST, no SDK) and AI-suggested GIFs via `gifQuery`.
- A pixel progress bar for loading states, and a confetti burst on the first
  copy.
- Monogram avatars (initials on the accent color) when there is no photo.
- Banner image and GIF support in every template.
- Local draft persistence and "how to add it" steps for Gmail, Outlook and Apple
  Mail.
- A rebuilt template catalog: 24 hand-built designs in six styles (Classic,
  Minimal, Elegant, Modern, Bold, Friendly) with four layouts each. Every design
  is its own renderer in `src/lib/signature/designs`, composed from a shared kit
  (`src/lib/signature/kit.ts`) of type, spacing and colour tokens and email-safe
  primitives.
- Every design draws every field you enter, once: department, the full address,
  all social links, the logo, the photo or monogram, the booking button and the
  disclaimer. It also follows the Divider, Photo shape, Spacing and Text size
  controls and the Accent line colour. (Eight of the thirteen earlier layouts
  dropped the disclaimer, and nine dropped the booking button.)
- Email-client hardening for Outlook for Windows and Gmail: padding, borders and
  backgrounds on table cells only, image sizes as HTML attributes, exact line
  heights, bold or normal weights, presentational tables, buttons and chips
  built as cells, and phone numbers as `tel:` links. A full design plus the
  credit line stays under 8,000 characters, below Gmail's 10,000 character cap.
- Colour roles with real contrast: an accent used as small text is darkened to
  4.5:1 on white (the swatch itself stays for fills), muted text and the credit
  line meet AA in light and dark, and text on an accent fill picks white or
  near-black by contrast.
- Legacy template ids map to their successors, and saved drafts and share links
  with an unknown template open on the default design instead of being dropped.
- Design quality gates in `src/lib/signature-designs.test.ts`: field coverage,
  the controls, email safety, the size budget, distinct structures and colour
  contrast, run against every design.

### Changed

- AI generation runs on Theo, the AI orchestration API from HiTheo
  (hitheo.ai). SignForge sends one stateless completion per request with its own
  persona and reads the JSON design from the reply. Set `THEO_API_KEY`;
  `THEO_BASE_URL` and `THEO_MODE` are optional. The previous provider variables
  (`AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY`, `OPENAI_API_KEY` and the
  provider-specific key) are no longer read.
- The "Powered by Theo AI" credit and the header and footer links now point to
  hitheo.ai over https.
- The dev server uses the Next.js default port instead of a fixed one.
- The privacy and terms pages describe the Theo data flow, and the privacy page
  now lists everything the AI request carries.
- Contact details use letters and words by default (E, T, W, A or EMAIL, PHONE,
  WEB) instead of emoji. Startup and Tint keep email-safe mono letter tiles (a
  tinted table cell), and the booking buttons are plain text.
- Landing copy is rewritten in a declarative, countable register, and the counts
  (templates, fonts, scenes) are read from the registries.
- The AI scene instruction no longer names scenes; it points at the list it is
  given, so removing the pop-culture pack stays safe.
- Signature fonts are latin-only Fontsource imports. Every typeface is now
  self-hosted.
- Privacy and terms pages name TheoVex as the operator and disclose the GIPHY
  request. The Fontshare disclosure is gone.
- Content-Security-Policy allows `api.giphy.com` only (plus the optional scene
  media origin when configured). The Fontshare exceptions are removed.
- Compact Horizontal now shows the company name.
- The dark preview lifts low-contrast accent colors, as dark-mode email clients
  do. Exports are unchanged.
- The template picker has six style chips and shows each design's description
  as a tooltip. The AI prompt lists the designs compactly (id, style word,
  best-for) and no longer hard-codes template ids, which cuts the system prompt
  from about 20,000 to under 10,000 characters.
- The in-app preview draws what an inbox draws: rounded cells keep their
  corners, and boxes use the email-client box model. Social links read X in
  place of a mathematical letter that some fonts cannot draw.
- The demo personas use five different designs.

### Fixed

- AI and shared text was HTML-escaped twice, so names like `O'Brien & Sons`
  rendered as entities. Data is now stored raw and escaped once at render time.
- URLs were inserted into `href`/`src` without escaping quote characters, which
  allowed attribute injection from a crafted share link. URLs are now
  percent-encoded and attribute-escaped, and font, color and size values are
  normalized before they reach a `style` attribute.
- Centered templates now actually center the photo and logo.

### Removed

- General Sans (Fontshare) and Instrument Serif, with the rounded-pill,
  rainbow-ring, sparkle and glow treatments of the earlier redesign.
- Every emoji from the UI, the scene copy and the exported HTML.
- Third-party and trademarked assets from `public/`: the Star Wars and
  Spider-Man fonts and artwork, show footage and logos, stock icons, and 190 MB
  of background videos. The themed scenes return as text-only tributes with
  original pictograms.
- The template ids `creative-gradient` and `banner-cta`. Old share links and
  saved drafts that carry them open on `tint-panel` and `name-plate`.

## [1.0.0] - 2026-01-15

### Added

- Complete rewrite into a chat-first, agentic experience.
- OpenAI-compatible AI provider with robust JSON parsing and validation.
- Nine email-safe signature templates rendered from a single pure HTML generator
  used by both preview and export.
- Refine panel for manual editing of fields, templates, colors, fonts, and
  social links.
- Live email-client preview with light/dark toggle.
- Export: copy rich HTML, copy raw HTML, download `.html`, and share via URL.
- Unit tests (Vitest) for sanitizers, the HTML generator, and AI parsing.
- GitHub Actions CI (lint, typecheck, test, build).
- Apache 2.0 licensing with NOTICE attribution.

### Removed

- Parody/entertainment email themes and 3D/particle/video/animation effects.
- GIF picker, image upload (R2), donation flows, and Turnstile bot protection.
- Upstash rate limiting (replaced with in-memory limiting).
- Legacy OpenAI-only, storage-backed generation/upload routes.
