# SignForge

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![CI](https://github.com/arihealthbird/signforge/actions/workflows/ci.yml/badge.svg)](https://github.com/arihealthbird/signforge/actions/workflows/ci.yml)

**Email signatures from a single sentence.**

[signforge.com](https://signforge.com) · [Docs](docs/README.md) · [Self-hosting](docs/self-hosting.md) · [Fork it](docs/forking-and-rebranding.md)

SignForge is a free, open-source, AI-powered email signature builder from
[TheoVex](https://theovex.com). It works with [Theo](https://hitheo.ai), the AI
orchestration API from HiTheo, or with any chat completions API you choose. Tell
it who you are and how it should look
(*"Priya Shah, pediatric nurse practitioner. Calm, trustworthy, soft green."*) and
it designs a signature you can paste straight into Gmail, Outlook or Apple Mail.
Then keep chatting to refine it, or fine-tune it by hand.

- **Design by conversation.** Describe it, then ask for changes ("bolder",
  "more minimal", "add a waving GIF") and the AI edits the design.
- **Voice and images.** With Theo, dictate your request with the microphone, or
  attach a reference image and the AI matches its palette and mood. Both are
  hidden when the provider cannot serve them.
- **Email-safe export.** Table-based HTML with inline styles and no external
  assets, built to the limits of Outlook for Windows and to stay under Gmail's
  10,000 character signature cap. Contact details use letters and words (E, T,
  W, A or EMAIL, PHONE, WEB) instead of emoji or hosted icons.
- **24 distinct designs.** Six styles (Classic, Minimal, Elegant, Modern, Bold,
  Friendly) of four hand-built layouts each. Every design draws every field you
  enter and follows the Divider, Photo shape, Spacing and Text size controls.
- **Live studio.** Live template thumbnails, 10 color themes, 18 fonts, social
  links, a monogram avatar when you have no photo, and a light/dark and
  phone-width preview.
- **GIFs.** Add an animated banner from GIPHY (optional).
- **Eleven preview scenes.** Six original inboxes (classic, pirate, bard, surf,
  noir, cosmic) and a pop-culture pack of five unofficial tributes (The Office,
  Parks & Rec, Darth Vader, Yoda, Spider-Man), each with its own title bar,
  sample email and ambient canvas effect. They never change the exported HTML.
- **A real icon system.** Lucide through one registry, plus a few original
  pictograms. No emoji anywhere in the UI or the export.
- **Private by design.** No accounts, no database. Your signature lives in your
  browser.
- **Apache 2.0.** Fork it, host it, extend it (see
  [Forking and rebranding](docs/forking-and-rebranding.md)).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure your keys
cp .env.example .env.local
#    Enable one AI provider in .env.local (see below)

# 3. Run the dev server
npm run dev
```

The dev server prints its address when it starts. It listens on port 3000 unless
you set `PORT`.

### Environment variables

| Variable                       | Required | Purpose                                                         |
|--------------------------------|----------|-----------------------------------------------------------------|
| `THEO_API_KEY`                 | One of   | AI generation through Theo (server-side only)                   |
| `THEO_BASE_URL`, `THEO_MODE`   | No       | Override the Theo endpoint, or set `think` for deeper reasoning |
| `AI_API_KEY`                   | One of   | Any chat completions API instead of Theo (server-side only)     |
| `AI_BASE_URL`, `AI_MODEL`      | With `AI_API_KEY` | The provider's https base URL, and the model to use    |
| `AI_EXTRA_BODY`                | No       | Extra JSON fields for every request, for provider-specific options |
| `AI_PROVIDER_NAME`, `AI_PROVIDER_URL` | No | Names the provider in the privacy policy                      |
| `NEXT_PUBLIC_GIPHY_API_KEY`    | No       | Enables the GIF picker and AI GIF suggestions                   |
| `NEXT_PUBLIC_SCENE_MEDIA_BASE` | No       | https URL of a folder of scene backdrop videos (see below)      |

### AI provider

SignForge needs one AI provider, chosen through environment variables. If both
are set, Theo is used.

**Theo.** [Theo](https://hitheo.ai) is the AI orchestration API from HiTheo.
SignForge is an E.V.I., an embedded virtual intelligence: its own persona (the
signature designer) on top of Theo's engine, which classifies each request and
routes it to a model. Create a key in the Theo dashboard
([guide](https://docs.hitheo.ai/quickstart/get-api-key)), then:

```bash
THEO_API_KEY=your-theo-api-key
# THEO_MODE=think      # deeper reasoning, a little slower
```

Theo also powers voice dictation and image references in the chat box.

**Any chat completions API.** Point SignForge at any provider that offers the
common `POST /chat/completions` shape:

```bash
AI_API_KEY=your-provider-api-key
AI_BASE_URL=https://api.example.com/v1
AI_MODEL=your-model-name
# AI_PROVIDER_NAME=Example AI          # shown in the privacy policy
# AI_PROVIDER_URL=https://example.com
```

This path is text only, so voice dictation and image references are switched off
and the chat box hides their buttons. Set `AI_PROVIDER_NAME` so the privacy
policy tells visitors who receives their requests.

Some reasoning models think for a long time before they answer, which is slow and
can use up the whole token budget. If yours does, pass your provider's switch for
it with `AI_EXTRA_BODY`, for example
`AI_EXTRA_BODY={"thinking":{"type":"disabled"}}`.

Keep real keys out of your shell history, chat and screenshots. A vault such as
[AIRCTRL](https://airctrl.dev) stores keys and environment variables encrypted
and scoped by project and environment. To build on Theo yourself, see the
[HiTheo docs](https://docs.hitheo.ai).

GIPHY keys are designed to be public, which is why that one is read in the
browser. Get a free key at [developers.giphy.com](https://developers.giphy.com).
Without it the GIF picker is hidden and people can still paste a GIF URL.

---

## Scripts

| Command             | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start the development server       |
| `npm run build`     | Production build                   |
| `npm run start`     | Run the production build           |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | TypeScript type checking           |
| `npm run test`      | Vitest unit tests                  |

---

## How it works

1. **Prompt.** Your request is POSTed to `/api/generate` along with the current
   signature (when refining) and the current preview scene.
2. **Generate.** The server sends the request to the configured AI provider
   with the signature designer persona (`src/lib/ai-provider.ts` picks Theo or a
   chat completions API), then validates the JSON design that comes back into a
   safe `SignatureData` object (`src/lib/ai.ts`). The model can also pick a
   preview scene and ask for a GIF search.
3. **Render.** A pure HTML generator (`src/lib/signature-html.ts`, with one
   hand-built renderer per template in `src/lib/signature/designs`) turns the
   data into email-safe markup. The same generator powers the live preview, the
   template thumbnails and the export.
4. **Refine.** The Design, Details and Extras tabs edit the data directly, with
   no round-trip.
5. **Export.** Copy rich HTML for Gmail or Outlook, copy the raw HTML, download a
   `.html` file, or share a compact link.

### Project structure

```
src/
├── app/
│   ├── page.tsx                 # Landing + studio state machine
│   ├── layout.tsx               # Fonts, metadata, page backdrop
│   ├── globals.css              # TheoVex skin tokens, utilities, motion (Tailwind v4)
│   ├── privacy/  terms/         # Legal pages
│   └── api/                     # generate (AI), transcribe (voice), capabilities
├── components/
│   ├── landing.tsx              # Hero, index strip, live demo, steps, features, TheoVex band
│   ├── studio.tsx               # Workspace: tabs, scene picker, preview, export
│   ├── scene-picker.tsx         # Grouped scene popover (icon tile + name)
│   ├── email-window.tsx         # Mock email client + scene stage
│   ├── scene-fx.tsx             # Canvas effects engine (no dependencies)
│   ├── scene-backdrop.tsx       # Optional looping video, only with a media base
│   ├── icons.tsx                # Icon registry: Icon, IconTile (Lucide + pictograms)
│   ├── signature-html.tsx       # The one place signature HTML is injected
│   ├── composer.tsx  chat-thread.tsx  panels.tsx  export-bar.tsx  giphy.tsx
│   ├── brand.tsx                # SignForge + TheoVex marks, wordmarks, pill
│   ├── forest-still.tsx         # Static pixel forest for the footer (ported from TheoVex)
│   └── site-header.tsx  site-footer.tsx  page-background.tsx  ui.tsx  toast.tsx  theme-toggle.tsx
├── scenes/
│   ├── core/                    # classic, pirate, bard, surf, noir, cosmic
│   ├── pop-culture/             # the removable tribute pack
│   ├── index.ts                 # The registry: one import per pack
│   ├── types.ts  helpers.ts  backdrop.ts
├── lib/
│   ├── ai.ts                    # Prompting, JSON parsing, validation
│   ├── ai-provider.ts           # Picks the provider from the environment
│   ├── theo.ts                  # Client for the Theo AI orchestration API
│   ├── chat-completions.ts      # Client for any chat completions API
│   ├── attachments.ts  capabilities.ts  use-capabilities.ts  legal-copy.ts  provider-error.ts
│   ├── signature-html.ts        # Public API of the HTML generator (single source of truth)
│   ├── signature/               # kit.ts (tokens + email-safe primitives), designs/ (24 renderers), index.ts
│   ├── pictograms.ts            # Original icons for what Lucide does not draw
│   ├── samples.ts  stats.ts     # Demo + example content, counts read from the registries
│   ├── templates.ts             # Template registry: metadata and retired ids
│   ├── security.ts              # Escaping, URL/color validation, rate limiting
│   ├── forest-palettes.ts  color.ts  cn.ts  share.ts  confetti.ts  hooks.ts  site.ts
└── types/signature.ts           # SignatureData model + fonts/colors/social constants
public/brand/theovex/            # TheoVex wordmarks (trademarks, not Apache-2.0)
```

### Design principles

- **One generator for everything.** `generateSignatureHTML()` produces the exact
  HTML used for the preview and the export, so what you see is what you paste.
- **Escape once, at render time.** Data is stored raw. Text goes through
  `escapeHtml()`, attribute values through `escapeAttr()`, URLs through
  `validateUrl()` (which also percent-encodes quote characters), and every value
  that lands in a `style` attribute is normalized first.
- **No server storage.** Signature data lives in browser state (and an optional
  local draft). Rate limiting is in-memory.

### Design system

SignForge wears the TheoVex house skin, ported from theovex.com:

- **Surfaces.** A warm paper canvas (`#f4f3ef`, dark `#0b0c11`), ink, 1px lines,
  and a soft wash with fine grain. Tokens live in `src/app/globals.css`.
- **Shape.** Squared corners across the whole shell (`border-radius: 0` outside
  `[data-skin]`), 2px ink borders and hard offset shadows on the things you
  press. Only the signature itself renders inside a `data-skin` wrapper, so its
  circles and rounded cards look exactly as exported.
- **Accent.** Neon `#D4FF00` is SignForge's product accent, used as a
  background: the active-state offset shadow, status dots and highlights.
  Never as text ink on a light surface.
- **Type.** Geist 800 for display, Geist Mono for numbered eyebrows
  (`02 · HOW IT WORKS`), and Pixelify Sans for the `forge` wordmark token.
  Everything is self-hosted through Fontsource.
- **Icons.** `<Icon name="copy" />` and `<IconTile name="mail" tint="#d4ff00" />`
  from `src/components/icons.tsx`. Lucide is the base; the pictograms in
  `src/lib/pictograms.ts` (stapler, waffle, web, saber hilt, fedora) cover what
  Lucide does not draw, on the same 24px grid and 2px stroke.

### Scene packs

Scenes are the mood of the mock inbox: title bar, sample email, an icon, an
accent and an ambient effect. The AI can pick one from `sceneDescription()`.

- `src/scenes/core` holds the six original scenes.
- `src/scenes/pop-culture` holds five unofficial tributes: The Office, Parks &
  Rec, Darth Vader, Yoda and Spider-Man. They restore the old themes' voice and
  look (parody copy, title-bar gradients, accents, window dots) with new
  original pictograms and canvas effects. No show footage, official logos,
  studio artwork or commercial fonts are included, and the picker says the
  tributes are unofficial.
- The pack is **one import** in `src/scenes/index.ts`. To ship without it,
  delete the folder, remove that import and its spread, and drop `PopSceneId`
  from `src/scenes/types.ts`. The picker, the landing counts and the AI prompt
  all follow the registry.

### Optional scene backdrops

Some scenes (pirate, bard, surf, Vader, Yoda, Spider-Man) can show a short
looping video behind the window. **No media is committed to this repo.** To
enable them, bring your own loops (ones you made or have the right to use),
re-encode them small, host them over https, and set
`NEXT_PUBLIC_SCENE_MEDIA_BASE`:

```bash
# a 10 second loop at roughly 1 to 1.5 MB, plus a poster frame
ffmpeg -i in.mp4 -an -vf "scale=960:-2,fps=24" -c:v libx264 -crf 30 -preset slow \
  -movflags +faststart pirate.mp4
ffmpeg -i pirate.mp4 -frames:v 1 -q:v 4 pirate.jpg

# .env.local
NEXT_PUBLIC_SCENE_MEDIA_BASE=https://cdn.example.com/signforge-scenes
```

File names are `<scene>.mp4` and `<scene>.jpg` (see each scene's `backdrop`).
The video loads only when that scene is picked, is skipped under reduced
motion, and the CSP allows only the configured origin. Unset, every scene falls
back to its canvas effect.

---

## Third-party services

SignForge makes these requests on your behalf. Each has a plain opt-out.

- **Your AI provider** receives the text of AI requests, the recent
  conversation and the signature being edited: Theo (`www.hitheo.ai`) or the
  chat completions API you configure. With Theo it also receives reference
  images and voice recordings. Leave both keys unset to turn AI generation off.
  For Theo, see HiTheo's
  [data privacy notes](https://docs.hitheo.ai/security/data-privacy). The
  [privacy page](src/app/privacy/page.tsx) names whichever provider is in use.
- **GIPHY** (`api.giphy.com`) is contacted from the browser when the GIF picker is
  used. Unset `NEXT_PUBLIC_GIPHY_API_KEY` to disable it.
- **Scene media host** (only if you set `NEXT_PUBLIC_SCENE_MEDIA_BASE`) serves
  the optional backdrop videos.

Every typeface is self-hosted through Fontsource, so loading a page contacts no
font provider.

See the [privacy policy page](src/app/privacy/page.tsx) for the user-facing wording.

---

## Documentation

- [Architecture](docs/architecture.md) - how the data model, render pipeline,
  AI flow and security model fit together.
- [API](docs/api.md) - the `/api/generate`, `/api/transcribe` and
  `/api/capabilities` contracts.
- [Self-hosting](docs/self-hosting.md) - run your own instance with Node,
  Docker or Vercel.
- [Forking and rebranding](docs/forking-and-rebranding.md) - build your own
  branded version under Apache 2.0.

## Community

- [Discussions](https://github.com/arihealthbird/signforge/discussions) - ask
  questions and share ideas.
- [Issues](https://github.com/arihealthbird/signforge/issues) - report bugs and
  request features.
- [Code of Conduct](CODE_OF_CONDUCT.md) - how we expect everyone to behave.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All contributions are licensed under
Apache 2.0 and carry a [Developer Certificate of Origin](DCO) sign-off. Please
report security issues privately, as described in [SECURITY.md](SECURITY.md).

## License

[Apache License 2.0](LICENSE). See [NOTICE](NOTICE) for attribution details.

The TheoVex name, logo, wordmarks and pixel-robot mark are trademarks of TheoVex
and are not licensed under Apache 2.0. The pop-culture scenes are unofficial
tributes and are not affiliated with or endorsed by the works they parody.
