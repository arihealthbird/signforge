# Forking and rebranding

SignForge is Apache 2.0, so you can fork it, modify it, and run it however you
like - in your organization, as a product, or as the base for your own tool.
This guide covers what the license allows, what it does not, and how to make the
result your own.

## What Apache 2.0 gives you

The [Apache License 2.0](../LICENSE) is a permissive license. You may use, copy,
modify, distribute, sublicense and sell the code, commercially or not, without
paying royalties. Your obligations are:

- Keep a copy of the license and the [NOTICE](../NOTICE) (attribution) with
  substantial portions of the code you distribute.
- State clearly when you have changed files.
- Do not use TheoVex's trademarks or imply endorsement without permission.

## What is NOT licensed to you

The following are **not** covered by Apache 2.0, as documented in
[NOTICE](../NOTICE):

- The **TheoVex** name, logo, wordmarks and pixel-robot mark, and the
  **SignForge** name and mark. These are trademarks.
- The TheoVex brand files in `public/brand/theovex/`.
- The pixel-forest footer (`src/components/forest-still.tsx` and
  `src/lib/forest-palettes.ts`), which is part of TheoVex's brand look.
- The pop-culture scene pack (`src/scenes/pop-culture`): unofficial tributes
  that use third-party show and character names. They are not TheoVex's
  property either, so keep or remove them based on your own risk tolerance.
- **Theo** (hitheo.ai), the hosted AI service SignForge calls. It has its own
  terms and pricing. Apache 2.0 covers the code in this repository, not that
  service.

Everything else - the code, the templates, the kit, the pictograms, the core
scenes - is Apache 2.0.

## Rebranding checklist

1. **Names and links** - update `src/lib/site.ts`: `SITE` (name, tagline,
   description, `repoUrl`), `THEOVEX`, and `THEO_AI`. These feed the page
   metadata, the UI, and the export credit line.
2. **Brand assets** - delete `public/brand/theovex/` and replace the marks in
   `src/components/brand.tsx` (`TheoVexMark`, `SignForgeMark`) and the
   wordmarks with your own.
3. **Product accent** - the neon `#D4FF00` accent lives in the tokens in
   `src/app/globals.css` (the `neon` utility and its uses). Swap it for your
   brand color, keeping the rule that it is a background accent, not text ink
   on a light surface.
4. **Branding surfaces** - update the hero pill, the studio header chip, the
   "Build on theo." band, the footer (`src/components/dithered-footer.tsx`,
   `site-header.tsx`, `site-footer.tsx`, `landing.tsx`, `studio.tsx`) and the
   `ForestStill` footer art if you are not keeping it.
5. **Credit line** - the exported "Made with SignForge ..." line is built by
   `credit()` in `src/lib/signature-html.ts` from `SITE`/`THEOVEX`/`THEO_AI`.
   Change or remove it there.
6. **Legal pages** - update `src/app/privacy/page.tsx` and
   `src/app/terms/page.tsx`, which name TheoVex as the operator. Their AI
   sections are built from your provider settings (`src/lib/legal-copy.ts`), so
   set `AI_PROVIDER_NAME` if you use a chat completions API.
7. **Project metadata** - rename in `package.json`, `README.md`, and
   `.env.example`; update the DCO/`CONTRIBUTING.md` and `NOTICE` attribution
   (keep the original attribution when you retain substantial portions).

A reliable way to find every reference is to search the source for the strings
`TheoVex`, `SignForge`, `theovex` and `#D4FF00` after renaming the obvious
spots above.

## Removing the pop-culture pack

The tribute scenes are a single import. Delete
`src/scenes/pop-culture`, remove the import and its spread in
`src/scenes/index.ts`, and drop `PopSceneId` from `src/scenes/types.ts`. The
picker, landing counts and AI prompt all follow the registry, so nothing else
changes.

## Swapping the AI provider

You may not need to change any code. SignForge already talks to any chat
completions API: set `AI_API_KEY`, `AI_BASE_URL` and `AI_MODEL` (see
[Self-hosting](self-hosting.md#choosing-an-ai-provider)) and leave
`THEO_API_KEY` unset.

For a provider with a different shape, add a client next to
`src/lib/chat-completions.ts` that takes `{ prompt, persona, temperature,
signal }` and returns the reply text, throw a `ProviderError`
(`src/lib/provider-error.ts`) for every failure so `toServiceError` (`ai.ts`)
can map it, and add a case for it in `complete()` and `activeProvider()` in
`src/lib/ai-provider.ts`. Nothing else changes: the route, the sanitizers and the
tests around them do not depend on the provider. Set `getCapabilities()` to say
whether it can serve voice and images, and the composer follows.

Keep three properties when you do: the key stays server-side, requests carry an
abort signal so the route can time out, and logs never include the key or the
visitor's text.

## Keeping the quality gates

The tests in `src/lib/signature-designs.test.ts`, `pictograms.test.ts` and
`scenes.test.ts` encode the email-safety and no-emoji rules. Keep running
`npm run lint`, `npm run typecheck`, `npm run test` and `npm run build` after
your changes; a rebrand that drops a field or introduces a rounded corner will
be caught by the same gates that protect the upstream project.

## Trademark-safe guidance

- Pick a distinct name and mark for your fork, and use your own domain.
- Do not state or imply that TheoVex endorses, sponsors or maintains your fork.
- If you keep the export credit, leave the "a TheoVex project" wording intact
  only while you actually are affiliated; otherwise replace it with your own
  attribution, keeping the Apache 2.0 license and NOTICE as required.
