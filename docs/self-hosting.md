# Self-hosting

SignForge is a standard Next.js 16 app with no database. You need Node.js 20.9
or newer and a Theo API key. Everything else is optional.

## Prerequisites

- Node.js 20.9 or newer.
- A Theo API key. [Theo](https://hitheo.ai) is the AI orchestration API from
  HiTheo that designs the signatures. Create a key in the dashboard
  ([guide](https://docs.hitheo.ai/quickstart/get-api-key)).

## Configuration

Copy `.env.example` to `.env.local` and fill in your values.

| Variable                       | Required | Read                | Purpose |
| ------------------------------ | -------- | ------------------- | ------- |
| `THEO_API_KEY`                 | yes      | server              | Your Theo API key. Never prefix it with `NEXT_PUBLIC_`. |
| `THEO_BASE_URL`                | no       | server              | Defaults to `https://www.hitheo.ai`. Must be https. The apex `hitheo.ai` is rewritten to `www`, because the apex redirect drops the Authorization header. |
| `THEO_MODE`                    | no       | server              | `fast` (default), or `think`, which reasons for longer. |
| `NEXT_PUBLIC_GIPHY_API_KEY`    | no       | browser, build time | Enables the GIF picker. GIPHY keys are public by design. |
| `NEXT_PUBLIC_SCENE_MEDIA_BASE` | no       | browser, build time | Https folder of optional scene backdrop videos. |

Two things matter for deployment:

- **`NEXT_PUBLIC_*` variables are inlined at build time**, not runtime. Set them
  when you build (or as Docker build args), not in the running container's
  environment. They are client-side values: the GIPHY key is intentionally
  public, and the scene media base points at a host you control.
- **Server-only values** (`THEO_*`) are read from `process.env` at request time,
  so you can set or rotate them without rebuilding.

Without `THEO_API_KEY` the site still builds and serves, and `/api/generate`
answers `503` with "AI is not configured".

## Run it

```bash
npm ci
npm run dev          # development server: port 3000 unless PORT is set
npm run build
npm run start        # production server: port 3000 unless PORT is set
```

## Deploy with Docker

A [`Dockerfile`](../Dockerfile) and [`docker-compose.yml`](../docker-compose.yml)
are included. Put `THEO_API_KEY` (and any optional values) in a `.env` file next
to `docker-compose.yml`, or export them in your shell, then:

```bash
docker compose up --build
```

The container runs the production server on port `3000` as a non-root user.
Compose refuses to start without `THEO_API_KEY`. Pass the build-time
`NEXT_PUBLIC_*` values through `build.args` in `docker-compose.yml` (or with
`--build-arg`). The `.dockerignore` keeps every `.env*` file out of the image.

## Deploy on Vercel

Import the repository, then add the variables under Project Settings,
Environment Variables: for Production, and for Preview if you want preview
deployments to generate signatures. Redeploy after you change a variable.

Vercel's serverless runtime works as-is, with one caveat: the rate limiter is
**in-memory and per-instance**, so across many concurrent serverless instances
the effective per-IP limit scales up. For a public, high-traffic deployment,
front it with an edge rate limit rather than relying on the in-process limiter.

## Managing secrets

Keep `THEO_API_KEY` in your platform's secret store, never in the repository.
`.env.local` is already gitignored. A vault such as
[AIRCTRL](https://airctrl.dev) works well for this: it keeps keys and
environment variables encrypted, scoped by project and environment
(development, staging, production), and out of prompts, chat and shell history.

## Your Theo key

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

## Multi-instance note

SignForge's own limiter in `src/lib/security.ts` is a per-process sliding window.
On a single Node or Docker instance that is exactly 12 requests per minute per
IP; on a serverless or horizontally scaled deployment it becomes a per-instance
budget. There is no shared store, by design (no database, no accounts). If you
need a global limit, add a Redis-backed limiter or an edge proxy. Theo's per-key
limit above is a second, global ceiling.

## Optional services

- **GIPHY**: set `NEXT_PUBLIC_GIPHY_API_KEY` at build time to enable the GIF
  picker. Unset, the picker is hidden and users can still paste a GIF URL.
- **Scene backdrops**: set `NEXT_PUBLIC_SCENE_MEDIA_BASE` at build time to a
  folder of self-hosted loops (named `<scene>.mp4` and `<scene>.jpg`). No media
  ships with the repository.

## Security in deployment

- Serve over HTTPS. The app sends `Strict-Transport-Security` with `preload`.
- Keep `THEO_API_KEY` out of any `NEXT_PUBLIC_*` variable and out of the
  repository. SignForge only ever sends it to Theo, over https.
- The Content-Security-Policy in `src/proxy.ts` allows only the origins the
  features need (self, `api.giphy.com`, and the scene media origin when set).
  If you add an image or script host, update the CSP in the same file.
- Your visitors' requests are processed by Theo under your key. Tell them so:
  the privacy page (`src/app/privacy/page.tsx`) describes the data flow, and you
  should review it for your own deployment.
