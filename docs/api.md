# API

SignForge has three endpoints. `POST /api/generate` turns a prompt (and, when
refining, the current signature) into a new signature. `POST /api/transcribe`
turns a voice recording into text. `GET /api/capabilities` tells the browser
which optional features this deployment offers.

The POST endpoints are protected by a same-origin policy (CORS + CSRF) in
`src/proxy.ts`, so cross-site requests are rejected. They are meant to be called
from the app itself, not as a general public API.

## POST /api/generate

```
POST /api/generate
Content-Type: application/json
```

| Field         | Type            | Required | Notes |
| ------------- | --------------- | -------- | ----- |
| `prompt`      | string          | yes      | The user's request. Max 2000 characters. |
| `currentData` | `SignatureData` | no       | The signature being refined. Validated and stripped of dangerous keys. |
| `template`    | string          | no       | The current template id, if refining. Must be a known id. |
| `scene`       | string          | no       | The current scene id, if refining. Must be a known id. |
| `history`     | array           | no       | Conversation memory as `{ role, text }` pairs. `role` is `user` or `assistant`. Bounded to 12 turns and 2000 characters per turn. |
| `attachments` | array           | no       | Up to 3 reference images as `{ data, mimeType }`: base64 without a `data:` prefix, and `image/png`, `image/jpeg` or `image/webp`. Anything else is dropped. Only used when the provider supports images (see [capabilities](#get-apicapabilities)). |

Example:

```json
{
  "prompt": "Priya Shah, pediatric nurse practitioner. Calm, soft green.",
  "currentData": null,
  "scene": null,
  "history": []
}
```

### Response

On success the route returns `200` with a JSON body:

| Field       | Type          | Notes |
| ----------- | ------------- | ----- |
| `signature` | `SignatureData` | The normalized, sanitized signature. |
| `template`  | string or null | The chosen template id. |
| `scene`     | string or null | The chosen scene id. |
| `gifQuery`  | string or null | A family-friendly GIF search phrase, when the user asked for a GIF. |
| `message`   | string or null | A one-to-two-sentence account of what changed and why. |
| `changes`   | array         | A bounded list of `{ field, note }` for the fields the model set or changed. |

All values in `signature` have already passed validation: URLs are validated
and percent-encoded, colors are 6-digit hex, fonts are mapped by label, enums
are whitelisted, and text has angle brackets and control characters stripped.

### Errors

| Status | Meaning |
| ------ | ------- |
| `400`  | Invalid JSON body, missing/oversized `prompt`, or invalid `currentData`. |
| `429`  | Rate limited (see below), or the AI provider rate limited the API key. |
| `500`  | The provider returned a reply SignForge could not use, or rejected the request. |
| `503`  | No provider is configured, the provider rejected the key, or the provider is unavailable. |
| `504`  | The AI request exceeded the 30 second timeout. |

Every error body is `{ "error": "human-readable message" }`.

## POST /api/transcribe

Voice dictation. Available only when Theo is the provider; otherwise it answers
`503` with "Voice is not configured."

```
POST /api/transcribe
Content-Type: multipart/form-data
```

| Field      | Type   | Required | Notes |
| ---------- | ------ | -------- | ----- |
| `file`     | file   | yes      | The recording: WebM, MP4, M4A, MP3, MPEG, MPGA or WAV, up to 10 MB. Codec parameters such as `audio/webm;codecs=opus` are accepted. |
| `language` | string | no       | A language code such as `en` or `es`. A regional tag like `en-US` is reduced to `en`. Anything else is ignored. |

On success: `200` with `{ "text": "..." }`. Errors: `400` for a missing, empty or
unsupported file, `413` over 10 MB (checked from `Content-Length` before the
upload is read), `422` when no speech was found, `429` when rate limited (12 per
minute per client IP, separate from `/api/generate`), `503` when voice is not
configured or the provider is unavailable, and `504` after 30 seconds.

## GET /api/capabilities

Reports which optional composer features this deployment can serve, so the
browser offers only those. It is evaluated on every request and never cached,
because a self-hosted container receives its keys at runtime.

```json
{ "voice": true, "images": true }
```

Both are `true` when Theo is the provider and `false` with any other provider.
The response names no provider and carries no other data.

## Rate limiting and timeout

- Requests are rate limited **in memory** to 12 per minute per client IP
  (`src/lib/security.ts`). The client IP comes only from a header the platform
  in front of the app controls: `x-vercel-forwarded-for` on Vercel, the header
  named in `TRUSTED_IP_HEADER` if you set one, otherwise `x-real-ip` or the
  first `x-forwarded-for` entry (see
  [Client IP and rate limiting](self-hosting.md#client-ip-and-rate-limiting)).
  The limit is per-process, so a multi-instance deployment does not share one
  global bucket.
- Your AI provider may rate limit the API key as well. When that limit is hit the
  route answers `429` with "AI service is busy".
- The upstream AI call has a 30 second timeout.

## The model response is not exposed

The raw model JSON is an implementation detail. `coerceSignature` in
`src/lib/ai.ts` maps it onto safe data before anything is returned, so the
shape above is the only contract you should rely on. When a reply cannot be
parsed, the log records only its length, never its text, because a reply can
echo what the visitor typed.
