# API

SignForge has one public endpoint: `POST /api/generate`. It is used by the
studio to turn a prompt (and, when refining, the current signature) into a new
signature.

The endpoint is protected by a same-origin policy (CORS + CSRF) in
`src/proxy.ts`, so cross-site requests are rejected. It is meant to be called
from the app itself, not as a general public API.

## Request

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

Example:

```json
{
  "prompt": "Priya Shah, pediatric nurse practitioner. Calm, soft green.",
  "currentData": null,
  "scene": null,
  "history": []
}
```

## Response

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

## Errors

| Status | Meaning |
| ------ | ------- |
| `400`  | Invalid JSON body, missing/oversized `prompt`, or invalid `currentData`. |
| `429`  | Rate limited (see below), or Theo rate limited the API key. |
| `500`  | Theo returned a reply SignForge could not use, or rejected the request. |
| `503`  | `THEO_API_KEY` is missing or was rejected, or Theo is unavailable. |
| `504`  | The AI request exceeded the 30 second timeout. |

Every error body is `{ "error": "human-readable message" }`.

## Rate limiting and timeout

- Requests are rate limited **in memory** to 12 per minute per client IP
  (`src/lib/security.ts`). The client IP is read from the `cf-connecting-ip`,
  `x-real-ip` or `x-forwarded-for` header. The limit is per-process, so a
  multi-instance deployment does not share one global bucket.
- Theo rate limits each API key as well. When that limit is hit the route answers
  `429` with "AI service is busy".
- The upstream AI call has a 30 second timeout.

## The model response is not exposed

The raw model JSON is an implementation detail. `coerceSignature` in
`src/lib/ai.ts` maps it onto safe data before anything is returned, so the
shape above is the only contract you should rely on.
