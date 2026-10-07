# SignForge

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![CI](https://github.com/arihealthbird/signforge/actions/workflows/ci.yml/badge.svg)](https://github.com/arihealthbird/signforge/actions/workflows/ci.yml)

**Email signatures from a single sentence.**

SignForge is a free, open-source, AI-powered email signature builder from
[TheoVex](https://theovex.com). Tell it who you are and how it should look
(*"Priya Shah, pediatric nurse practitioner. Calm, trustworthy, soft green."*) and
it designs a signature you can paste straight into Gmail, Outlook or Apple Mail.
Then keep chatting to refine it, or fine-tune it by hand.

- **Design by conversation.** Describe it, then ask for changes ("bolder",
  "more minimal", "add a waving GIF") and the AI edits the design.
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
#    Paste your keys into .env.local (see below)

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3018](http://localhost:3018).

### Environment variables

| Variable                        | Required | Purpose                                                  |
|---------------------------------|----------|----------------------------------------------------------|
| `NOVITA_API_KEY`                | Yes      | AI generation (server-side only)                         |
| `NEXT_PUBLIC_GIPHY_API_KEY`     | No       | Enables the GIF picker and AI GIF suggestions            |
| `NEXT_PUBLIC_SCENE_MEDIA_BASE`  | No       | https URL of a folder of scene backdrop videos (see below) |
| `AI_BASE_URL`, `AI_MODEL`       | No       | Point at another OpenAI-compatible provider/model        |

SignForge works with any OpenAI-compatible chat endpoint. By default it targets
[Novita.ai](https://novita.ai). Create a key there, then:

```bash
NOVITA_API_KEY=your-novita-api-key
# AI_BASE_URL=https://api.novita.ai/openai/v1
# AI_MODEL=deepseek/deepseek-v4-flash   # for higher quality: deepseek/deepseek-v4-pro
```

GIPHY keys are designed to be public, which is why that one is read in the
browser. Get a free key at [developers.giphy.com](https://developers.giphy.com).
Without it the GIF picker is hidden and people can still paste a GIF URL.

---

## Scripts

| Command             | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start the dev server on port 3018  |
| `npm run build`     | Production build                   |
| `npm run start`     | Run the production build           |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | TypeScript type checking           |
| `npm run test`      | Vitest unit tests                  |

---

## How it works

1. **Prompt.** Your request is POSTed to `/api/generate` along with the current
   signature (when refining) and the current preview scene.
2. **Generate.** The server asks your AI provider for a JSON design and
   validates it into a safe `SignatureData` object (`src/lib/ai.ts`). The model
   can also pick a preview scene and ask for a GIF search.
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
│   └── api/generate/route.ts    # AI generation endpoint
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

- **AI provider** (Novita.ai by default) receives the text of AI requests.
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
- [API](docs/api.md) - the `/api/generate` contract.
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
