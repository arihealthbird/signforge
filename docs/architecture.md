# Architecture

SignForge is a Next.js 16 (App Router) app with a small API and no database.
This page describes how the pieces fit together so you can extend or fork it
with confidence.

## Overview

A visitor describes a signature in plain English. The browser POSTs that request
to the AI route, which calls the configured AI provider, validates the
result, and returns a normalized `SignatureData` object. A pure HTML generator
turns that object into email-safe markup, and the same generator powers the live
preview, the template thumbnails and the export.

```
browser (composer)
      │  POST /api/generate { prompt, currentData, scene, template, history }
      ▼
api/generate/route.ts   (rate limit, validate, strip keys, 30s timeout)
      ▼
lib/ai.ts               (prompts, extract JSON, coerceSignature)
      ▼
lib/ai-provider.ts      (picks the provider, one stateless completion)
      ▼
lib/theo.ts  or  lib/chat-completions.ts
      ▼
SignatureData           (canonical model, src/types/signature.ts)
      ▼
lib/signature-html.ts   (generateSignatureHTML: normalize -> renderer -> HTML)
      │
      ├── live preview (preserveFontVars: true)
      ├── template thumbnails
      └── export (copy / download / share link)
```

## The data model

`SignatureData` (`src/types/signature.ts`) is the single source of truth shared
by the AI layer, the preview, the URL-sharing codec and the exporter. It
holds identity, contact, address, social links, branding (logo, photo,
monogram), banner/GIF, style (colors, font, size), extras (disclaimer, calendar
link) and layout (divider, photo shape, padding). Companion constants live in
the same file: `FONT_OPTIONS`, `COLOR_THEMES` and `SOCIAL_PLATFORMS`.

Data is stored **raw** (never HTML-escaped before storage). It is escaped
exactly once, at render time, in the kit.

## The render pipeline

- `src/lib/signature-html.ts` exposes `generateSignatureHTML(data, templateId,
  options)` and is the single source of truth for preview and export.
- It normalizes the data (clamps the font size, resolves 6-digit hex colors,
  whitelists the enums, sanitizes the font stack) and builds a `Ctx` of tokens
  via `makeCtx` in `src/lib/signature/kit.ts`.
- The design's renderer draws the layout from the kit primitives. There are 24
  hand-built renderers (six styles x four layouts) in
  `src/lib/signature/designs`, keyed by `TemplateId` in `DESIGNS`
  (`src/lib/signature/index.ts`), so a missing renderer does not compile.
- A banner and an optional credit line are appended by the generator and follow
  the design's alignment (`DESIGN_ALIGN`).
- `wrapHtmlDocument` and `htmlToPlainText` produce the download file and the
  text/plain clipboard flavour.

Email safety is enforced in the kit, not in the designs: padding, borders and
backgrounds on table cells only; `role="presentation"` tables; inline styles
only; exact line heights with `mso-line-height-rule:exactly`; `normal`/`bold`
weights; images carry HTML `width`/`height`; no gradients, shadows, SVG,
classes or external assets. `src/lib/signature-designs.test.ts` checks all of it
against every design.

## The AI flow

`src/lib/ai.ts` builds a system prompt from the registries (templates via
`templateDescription()`, fonts from `FONT_OPTIONS`, scenes via
`sceneDescription()`) and sends it, with the user's request, to the configured
AI provider through `src/lib/ai-provider.ts`. SignForge is an E.V.I.: the system
prompt becomes the persona, each request is one stateless completion (no
conversation id, tools or skills), and the JSON in the reply is extracted and
mapped onto safe data with `coerceSignature`.

`coerceSignature` sanitizes every field: text is cleaned and angle brackets are
stripped, URLs go through `validateUrl`, colors through `sanitizeColor`, fonts
are mapped by exact label, enums are clamped, and a final
`sanitizeSignatureFields` pass re-validates URLs and colors. The model never
invents image URLs (the prompt says so, and empty URLs are the result).

Failures map onto the route's error codes in `toServiceError`, for any provider:
a rejected key is a 503 "not configured", the provider's rate limit is a 429,
and anything else it returns is a 503 or 500. Every provider client throws a
`ProviderError` (`src/lib/provider-error.ts`), and the log carries its request
id and code for support, never the key.

### Providers

`src/lib/ai-provider.ts` chooses the provider from the environment:

- **Theo** (`src/lib/theo.ts`) when `THEO_API_KEY` is set. It also serves voice
  dictation (`/api/transcribe`) and reference images.
- **Any chat completions API** (`src/lib/chat-completions.ts`) when
  `AI_API_KEY`, `AI_BASE_URL` and `AI_MODEL` are set. Text only, and it names no
  vendor.
- **Neither**: generation answers `AI_NOT_CONFIGURED`, a 503.

`GET /api/capabilities` reports whether voice and images are on (only with Theo),
so the composer hides the buttons that would fail. The privacy and terms pages
are built from `describeProvider()` and `src/lib/legal-copy.ts`, so they name
the provider that really receives the text.

## Registries

- **Templates** (`src/lib/templates.ts`): metadata only (id, name, description,
  category, `bestFor`). Retired ids live in `LEGACY_TEMPLATE_IDS` so old share
  links and drafts still resolve.
- **Scenes** (`src/scenes`): the mood of the mock inbox. A core pack and a
  removable pop-culture pack are combined in `src/scenes/index.ts`. Scenes only
  change the preview, never the export.
- **Icons** (`src/components/icons.tsx`): Lucide through one registry, plus
  original pictograms in `src/lib/pictograms.ts`. No emoji anywhere.

## Security model

- Input sanitization lives in `src/lib/security.ts`: `escapeHtml`,
  `escapeAttr`, `validateUrl` (blocks `javascript:`, `data:`, `vbscript:`,
  `file:` and private-network addresses), `sanitizeColor`,
  `sanitizeSignatureFields`, `validateSignatureData`, `stripDangerousKeys`
  (prototype-pollution guard) and an in-memory `checkRateLimit`.
- `src/proxy.ts` sets a per-request Content-Security-Policy and enforces
  same-origin on API POSTs (CORS + CSRF). `next.config.ts` adds the static
  security headers (HSTS, `X-Frame-Options`, `nosniff`, referrer and
  permissions policies).
- AI provider keys are server-only and only ever sent over https. The GIPHY key
  is intentionally public.
- Logs carry a provider's request id and error code, never a key or a visitor's
  text. A model reply that cannot be parsed is logged by length only.

See [SECURITY.md](../SECURITY.md) for the reporting policy and the
[self-hosting](self-hosting.md) guide for deployment hardening.
