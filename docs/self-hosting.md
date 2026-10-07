# Self-hosting

SignForge is a standard Next.js 16 app. You need Node.js 20+ and an AI provider
key. Everything else is optional.

## Prerequisites

- Node.js 20 or newer.
- An API key for an OpenAI-compatible provider. [Novita.ai](https://novita.ai)
  is the default and recommended provider, but any endpoint that speaks the
  `/chat/completions` protocol works.

## Configuration

Copy `.env.example` to `.env.local` and fill in your values.

| Variable                      | Required | Read | Purpose |
| ----------------------------- | -------- | ---- | ------- |
| `NOVITA_API_KEY`              | yes      | server | AI generation. Never prefix with `NEXT_PUBLIC_`. |
| `AI_API_KEY` / `OPENAI_API_KEY` | no     | server | Alternative key names, read as fallbacks. |
| `AI_BASE_URL`                 | no       | server | Defaults to `https://api.novita.ai/openai/v1`. |
| `AI_MODEL`                    | no       | server | Defaults to `deepseek/deepseek-v4-flash`. |
| `NEXT_PUBLIC_GIPHY_API_KEY`   | no       | browser (build-time) | Enables the GIF picker. Keys are public by design. |
| `NEXT_PUBLIC_SCENE_MEDIA_BASE` | no      | browser (build-time) | Https folder of optional scene backdrop videos. |

Two things matter for deployment:

- **`NEXT_PUBLIC_*` variables are inlined at build time**, not runtime. Set them
  when you build (or as Docker build args), not in the running container's
  environment. They are client-side values: the GIPHY key is intentionally
  public, and the scene media base points at a host you control.
- **Server-only values** (`NOVITA_API_KEY`, `AI_BASE_URL`, `AI_MODEL`) are read
  from `process.env` at request time and can be set at runtime.

## Deploy with Docker

A [`Dockerfile`](../Dockerfile) and [`docker-compose.yml`](../docker-compose.yml)
are included.

```bash
# From the repository root:
NOVITA_API_KEY=your-key docker compose up --build
```

The image runs the production server on port `3000`. Pass the build-time
`NEXT_PUBLIC_*` values through `build.args` in `docker-compose.yml` (or via
`--build-arg`). See the file for the exact keys.

## Deploy on Node

```bash
npm ci
npm run build
npm run start        # production server on port 3000
```

`npm run dev` runs the development server on port `3018`.

## Deploy on Vercel

Connect the repository and set the environment variables in the project
settings. Vercel's serverless runtime works as-is, with one caveat: the rate
limiter is **in-memory and per-instance**, so across many concurrent
serverless instances the effective per-IP limit scales up. For a public,
high-traffic deployment, front it with an edge rate limit (or Vercel's own
rate-limiting) rather than relying on the in-process limiter.

## Multi-instance note

The rate limiter in `src/lib/security.ts` is a per-process sliding window. On a
single Node/Docker instance that is exactly 12 requests per minute per IP; on a
serverless or horizontally scaled deployment it becomes a per-instance budget.
There is no shared store, by design (no database, no accounts). If you need a
global limit, add a Redis-backed limiter or an edge proxy.

## Optional services

- **GIPHY**: set `NEXT_PUBLIC_GIPHY_API_KEY` at build time to enable the GIF
  picker. Unset, the picker is hidden and users can still paste a GIF URL.
- **Scene backdrops**: set `NEXT_PUBLIC_SCENE_MEDIA_BASE` at build time to a
  folder of self-hosted loops (named `<scene>.mp4` and `<scene>.jpg`). No media
  ships with the repository.

## Security in deployment

- Serve over HTTPS. The app sends `Strict-Transport-Security` with `preload`.
- Keep `NOVITA_API_KEY` out of any `NEXT_PUBLIC_*` variable and out of the
  repository. `.env.local` is already gitignored.
- The Content-Security-Policy in `src/proxy.ts` allows only the origins the
  features need (self, `api.giphy.com`, and the scene media origin when set).
  If you add an image or script host, update the CSP in the same file.
