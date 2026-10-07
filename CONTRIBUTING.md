# Contributing to SignForge

Thanks for your interest! SignForge is a small, focused project, and
contributions are welcome.

## Ground rules

- Be kind and respectful. Everyone is expected to follow the
  [Code of Conduct](CODE_OF_CONDUCT.md).
- By submitting a pull request you agree that your contribution is licensed
  under the [Apache License 2.0](LICENSE).
- Sign off every commit with a `Signed-off-by:` trailer (see
  [Developer Certificate of Origin](#developer-certificate-of-origin-dco)).
  `git commit -s` adds it for you. A DCO check runs in CI.
- Keep changes scoped: one logical change per PR.

## Getting started

```bash
npm install
cp .env.example .env.local   # add a key if you want live AI generation
npm run dev
```

Before opening a PR, run the full check locally:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Adding a template

1. Add its metadata to `SIGNATURE_TEMPLATES` in `src/lib/templates.ts`: an id,
   name, description, category (one of the six styles) and a `bestFor` list. The
   AI picks a template from `bestFor`, so be specific.
2. Add a renderer in the matching file under `src/lib/signature/designs/` and
   compose it from the primitives in `src/lib/signature/kit.ts`. `DESIGNS` is
   typed by template id, so it will not compile without one. If the design is
   centered or right-aligned, list it in `DESIGN_ALIGN` in
   `src/lib/signature/index.ts`.
3. Run `npm run test`. `src/lib/signature-designs.test.ts` checks every design
   for field coverage, the Divider, Photo shape, Spacing and Text size controls,
   email safety, size and structure. A design that is a near copy of another
   fails.
4. To retire an id, add it to `LEGACY_TEMPLATE_IDS` instead of deleting it, so
   saved drafts and share links still open.

Rules for renderers:

- Table-based markup with inline styles only: no CSS classes, no `<svg>`, no
  external assets.
- Padding, borders and backgrounds go on table cells, never on links, spans or
  divs: Outlook for Windows ignores them there. Images carry HTML `width` and
  `height` attributes. Font weights are `normal` or `bold`. No gradients,
  shadows, opacity, margin spacing, min-width or border-spacing.
- Build from the kit (`trow`, `contacts`, `socials`, `button`, `mark`, `logo`,
  `footerRows`). It escapes and validates for you. Draw every field exactly once.
- No emoji or other pictographic characters. For contact labels use
  `contacts()`, which draws letters or words (and mono letter tiles in two
  designs). A test fails on any pictographic character in any template.
- Text goes through `esc()` (`escapeHtml`), attribute values through `attr()`
  (`escapeAttr`), and URLs through `url()` (`validateUrl`). Data is stored raw and
  escaped exactly once, in the kit. Never escape data before storing it.
- Take colors and sizes from the tokens (`c.t`): `ink`, `body`, `muted`,
  `accentInk` for small accent text, `onAccent` on fills and `rule` for the
  accent line. Never interpolate raw values into a `style` attribute or add
  ad-hoc greys.
- Keep a full-data design plus the credit line under 8,000 characters. Gmail
  stores at most 10,000 characters of signature HTML.

## Adding a font

1. Add the package (`npm i @fontsource/<family>`) and import only the `latin-*`
   CSS files you need in `src/app/layout.tsx`.
2. Add a `--font-<name>` variable to `:root` in `src/app/globals.css`.
3. Add an entry to `FONT_OPTIONS` in `src/types/signature.ts` with the full
   `var(--font-x), 'Font Name', fallback` stack.

Fonts must be SIL OFL (or similarly permissive) so they can be redistributed,
and must be self-hosted through Fontsource. A test fails if the source mentions
a third-party font host.

## Icons

Every icon in the UI goes through `src/components/icons.tsx`:

```tsx
<Icon name="copy" size="sm" />
<IconTile name="mail" tint="#d4ff00" size="md" />
```

- Add a Lucide icon by importing it in `icons.tsx` and giving it a semantic key
  in the `LUCIDE` map. Nothing else may import `lucide-react`.
- For something Lucide does not draw, add a pictogram to
  `src/lib/pictograms.ts`: original artwork on a 24 x 24 grid, a 2px stroke,
  round caps and joins, outlines unfilled, small solid details in `solids`.
  Check it at 16 to 24px before committing; `pictograms.test.ts` checks the
  grid and the syntax.
- No emoji anywhere. A source scan enforces it.

## Adding a preview scene

Scenes only change the mock inbox, never the exported HTML.

1. Add an entry to the right pack: `src/scenes/core/index.ts` for original
   scenes, or `src/scenes/pop-culture/index.ts` for tributes. Add its id to
   `CoreSceneId` or `PopSceneId` in `src/scenes/types.ts`.
2. Give it an `icon` (a key in the icon registry), an `accent` (6-digit hex), a
   `group`, a `blurb` for the AI and the tooltip, the sample email, the
   title-bar gradients, three window-dot colors and a stage wash.
3. Pick an effect from `FxKind` or add a behavior in
   `src/components/scene-fx.tsx` (and the kind to `FxKind`, and to the list in
   `src/scenes/scenes.test.ts`).
4. Optionally set a `font` (it must be an OFL face we ship) and a `backdrop`
   (file names under `NEXT_PUBLIC_SCENE_MEDIA_BASE`; no media goes in the repo).
5. Write the copy without emoji and without em dashes. `scenes.test.ts` checks
   the structure, the colors, the icon and the copy.

The pop-culture pack is a single import in `src/scenes/index.ts` so it can be
removed for a public release. Keep the demo samples (`src/lib/samples.ts`) on
core scenes so removing the pack never breaks the landing page.

## The TheoVex skin

- Use the tokens (`bg-canvas`, `bg-paper`, `text-ink`, `text-muted`,
  `border-line`, `bg-neon`) rather than hex values.
- The shell is squared. Do not add rounded corners; only the signature renders
  inside `data-skin`, through `SignatureHtml`.
- Neon is a background accent (an offset shadow, a dot, a highlight), never
  text ink on a light surface.
- No two utilities that set the same property on one element (the repo does
  not use tailwind-merge, so the winner is decided by stylesheet order).
- No em dashes in copy.

## Assets and licensing

Only add fonts, images, videos and icons you have the right to relicense under
Apache 2.0 (or that are clearly permissive, with attribution in `NOTICE`). No
third-party franchise artwork, logos, footage or fonts, and no stock-icon packs
with non-commercial terms. The pop-culture scenes use names and short parody
text only. The TheoVex brand files in `public/brand/theovex/` are trademarks and
are not licensed under Apache 2.0.

## Developer Certificate of Origin (DCO)

SignForge requires a [Developer Certificate of Origin](DCO) on every commit. A
`Signed-off-by:` trailer certifies that you have the right to submit the work
under Apache 2.0. Add it with `git commit -s`, or append the line yourself:

```
Signed-off-by: Your Name <you@example.com>
```

A DCO check runs in CI on every pull request.

## License headers

Add an SPDX header to new source files when practical:

```
// SPDX-License-Identifier: Apache-2.0
```

Do not retrofit headers onto existing files. Generated or data files
(lockfiles, fonts, JSON fixtures, minified assets) are excluded.

## Commit style

Use short, imperative subject lines:

```
feat: add minimal template
fix: validate email before linking
chore: bump deps
```
