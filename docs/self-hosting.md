# Self-hosting

SignForge is a standard Next.js 16 app with no database. You need Node.js 22.12
or newer and an AI provider key: a Theo API key, or a key for any chat
completions API. Everything else is optional.

## Prerequisites

- Node.js 22.12 or newer (Node 20 reached end of life in April 2026).
- An AI provider key, either:
  - [Theo](https://hitheo.ai), the AI orchestration API from HiTheo, which
    designs the signatures and also serves voice dictation and image references
    (create a key in the dashboard, [guide](https://docs.hitheo.ai/quickstart/get-api-key)), or
  - a key for any chat completions API: the common `POST /chat/completions`
    shape that OpenAI, OpenRouter, Together, Groq and many gateways offer.

## Configuration

Copy `.env.example` to `.env.local` and enable one provider.

| Variable                       | Required          | Read                | Purpose |
| ------------------------------ | ----------------- | ------------------- | ------- |
| `THEO_API_KEY`                 | one provider      | server              | Your Theo API key. Never prefix it with `NEXT_PUBLIC_`. When set, Theo is used. |
| `THEO_BASE_URL`                | no                | server              | Defaults to `https://www.hitheo.ai`. Must be https. The apex `hitheo.ai` is rewritten to `www`, because the apex redirect drops the Authorization header. |
| `THEO_MODE`                    | no                | server              | `fast` (default), or `think`, which reasons for longer. |
| `AI_API_KEY`                   | one provider      | server              | Your key for a chat completions API. Used when `THEO_API_KEY` is not set. |
| `AI_BASE_URL`                  | with `AI_API_KEY` | server              | The provider's base URL, for example `https://api.example.com/v1`. Must be https. Leave off `/chat/completions`. |
| `AI_MODEL`                     | with `AI_API_KEY` | server              | The model name to request. |
| `AI_EXTRA_BODY`                | no                | server              | A JSON object of extra fields added to every request, for options only your provider understands. See [Choosing an AI provider](#choosing-an-ai-provider). |
| `AI_PROVIDER_NAME`, `AI_PROVIDER_URL` | no         | server              | The provider's name and https URL, shown in the privacy policy. Without them the policy shows the host of `AI_BASE_URL`. |
| `TRUSTED_IP_HEADER`            | no                | server              | The one header your proxy sets or overwrites with the visitor's address, for rate limiting. See [Client IP and rate limiting](#client-ip-and-rate-limiting). |
| `NEXT_PUBLIC_GIPHY_API_KEY`    | no                | browser, build time | Enables the GIF picker. GIPHY keys are public by design. |
| `NEXT_PUBLIC_SCENE_MEDIA_BASE` | no                | browser, build time | Https folder of optional scene backdrop videos. |

Two things matter for deployment:

- **`NEXT_PUBLIC_*` variables are inlined at build time**, not runtime. Set them
  when you build (or as Docker build args), not in the running container's
  environment. They are client-side values: the GIPHY key is intentionally
  public, and the scene media base points at a host you control.
- **Server-only values** (`THEO_*`, `AI_*`, `TRUSTED_IP_HEADER`) are read from
  `process.env` at request time, so you can set or rotate them without
  rebuilding. The privacy and terms pages and `/api/capabilities` are rendered
  per request for the same reason.

Without a provider the site still builds and serves, and `/api/generate`
answers `503` with "AI is not configured".

## Choosing an AI provider

- **Theo wins.** If `THEO_API_KEY` is set it is used, even when the `AI_*`
  values are also set. Remove it to use the other provider.
- **Voice and images need Theo.** With a chat completions API the provider sees
  text only. SignForge hides the microphone and attach buttons (the browser asks
  `/api/capabilities`), and `/api/transcribe` answers `503`. Nothing is
  offered that would fail.
- **The privacy and terms pages follow the provider.** They name Theo, or the
  provider you set in `AI_PROVIDER_NAME`, or the host of `AI_BASE_URL`, so they
  never say text goes somewhere it does not. They also say that images and audio
  are off when they are.
- **Reasoning models work, but are better with thinking off.** The request
  allows 4000 output tokens, which covers the JSON design plus the thinking a
  reasoning model does first, and if a model leaves `content` empty SignForge
  reads `reasoning_content` instead. Thinking adds seconds to every request, and
  a model that thinks for too long can use the whole budget and return no
  design. If your provider has a switch for it, set it with `AI_EXTRA_BODY`, for
  example `{"thinking":{"type":"disabled"}}`. Its fields are added to every
  request and cannot replace `model`, `messages`, `stream`, `temperature` or
  `max_tokens`. Invalid JSON is refused, and the log names `AI_EXTRA_BODY`
  without printing it.
- **The URL and key stay safe.** `AI_BASE_URL` must be https and carry no
  credentials. The key is only ever sent to that URL, and logs carry a status
  and an error code, never the key or the visitor's text.

## Run it

```bash
npm ci
npm run dev          # development server: port 3000 unless PORT is set
npm run build
npm run start        # production server: port 3000 unless PORT is set
```

## Deploy with Docker

A [`Dockerfile`](../Dockerfile) and [`docker-compose.yml`](../docker-compose.yml)
are included. Put your provider settings (`THEO_API_KEY`, or the three `AI_*`
values, and any optional values) in a `.env` file next to `docker-compose.yml`,
or export them in your shell, then:

```bash
docker compose up --build
```

The container runs the production server on port `3000` as a non-root user.
Compose starts without a provider too, and generation then answers "AI is not
configured". Pass the build-time `NEXT_PUBLIC_*` values through `build.args` in
`docker-compose.yml` (or with `--build-arg`). The `.dockerignore` keeps every
`.env*` file out of the image.

## Deploy on Vercel

Import the repository, then add your provider's variables under Project
Settings, Environment Variables: for Production, and for Preview if you want
preview deployments to generate signatures. Redeploy after you change a
variable.

Vercel's serverless runtime works as-is, with one caveat: the rate limiter is
**in-memory and per-instance**, so across many concurrent serverless instances
the effective per-IP limit scales up. For a public, high-traffic deployment,
front it with an edge rate limit rather than relying on the in-process limiter.

## Managing secrets

Keep your provider key (`THEO_API_KEY` or `AI_API_KEY`) in your platform's secret
store, never in the repository. `.env.local` is already gitignored. A vault such
as [AIRCTRL](https://airctrl.dev) works well for this: it keeps keys and
environment variables encrypted, scoped by project and environment
(development, staging, production), and out of prompts, chat and shell history.

## If you use Theo

- **Use a dedicated key, and ideally a dedicated account, for SignForge.** Theo
  can apply the skills installed on an account to its completions, so a key from
  a busy account may change SignForge's output.
- **Set a per-key rate limit and spending cap** in the HiTheo dashboard. New keys
  start on the Free tier, which allows 60 requests per minute per key across all
  of your visitors. Request a tier increase before you send production traffic
  ([rate limits](https://docs.hitheo.ai/security/rate-limiting)).
- **Optionally turn on Gateway Guardrails** for the key, which enforce input and
  output policies on every completion
  ([guide](https://docs.hitheo.ai/guides/guardrails)).
- **Rotate the key from the dashboard** if it is ever exposed, then update your
  deployment.

## If you use another provider

- **Set a spending cap and a rate limit** in the provider's dashboard. Every
  visitor's request is billed to your key.
- **Pick a model that returns JSON reliably.** SignForge asks for a JSON object,
  extracts it from the reply (code fences and prose are tolerated) and
  validates every field, so a model that cannot follow the instruction answers
  with a generic failure rather than bad data.
- **Rotate the key** with the provider if it is ever exposed, then update your
  deployment.

## Multi-instance note

SignForge's own limiter in `src/lib/security.ts` is a per-process sliding window.
On a single Node or Docker instance that is exactly 12 requests per minute per
IP; on a serverless or horizontally scaled deployment it becomes a per-instance
budget. There is no shared store, by design (no database, no accounts). If you
need a global limit, add a Redis-backed limiter or an edge proxy. Your provider's
per-key limit is a second, global ceiling.

## Client IP and rate limiting

SignForge limits AI requests per visitor address, so it must read that address
from a header the visitor cannot forge. It trusts only headers that the platform
in front of the app sets or overwrites:

- **Vercel:** `x-vercel-forwarded-for`. Nothing to configure.
- **Another proxy or CDN:** set `TRUSTED_IP_HEADER` to the one header it sets or
  overwrites, for example `cf-connecting-ip` behind Cloudflare or `x-real-ip`
  behind nginx.
- **Otherwise:** `x-real-ip`, then the first `x-forwarded-for` entry. This is only
  safe behind a reverse proxy that overwrites those headers. A server exposed
  directly to the internet should set `TRUSTED_IP_HEADER` or rate limit at the
  edge, because a visitor can send it any header.

`cf-connecting-ip` is ignored unless you name it. On every host that is not
behind Cloudflare a visitor can send it, and a forged value would give each
request its own bucket and switch the limit off.

## Optional services

- **GIPHY**: set `NEXT_PUBLIC_GIPHY_API_KEY` at build time to enable the GIF
  picker. Unset, the picker is hidden and users can still paste a GIF URL.
- **Scene backdrops**: set `NEXT_PUBLIC_SCENE_MEDIA_BASE` at build time to a
  folder of self-hosted loops (named `<scene>.mp4` and `<scene>.jpg`). No media
  ships with the repository.

## Security in deployment

- Serve over HTTPS. The app sends `Strict-Transport-Security` with `preload`.
- Keep `THEO_API_KEY` and `AI_API_KEY` out of any `NEXT_PUBLIC_*` variable and out
  of the repository. SignForge only ever sends a key to its own provider, over
  https.
- The Content-Security-Policy in `src/proxy.ts` allows only the origins the
  features need (self, `api.giphy.com`, and the scene media origin when set).
  If you add an image or script host, update the CSP in the same file.
- Your visitors' requests are processed by your AI provider under your key. The
  privacy and terms pages (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`)
  name the provider you configure and describe the data flow. Set
  `AI_PROVIDER_NAME` for a chat completions API, and review both pages for your
  own deployment.
