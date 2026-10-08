# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue. Use
GitHub's private vulnerability reporting on this repository (Security tab, then
"Report a vulnerability"). If that is unavailable, reach TheoVex through
<https://theovex.com> and mention that it is a SignForge security report.

Include a clear description and, if possible, a minimal reproduction. We will
acknowledge your report as soon as possible and work with you to resolve it.

## Scope

SignForge is a client-side signature builder with a small API (`/api/generate`,
`/api/transcribe` and `/api/capabilities`). Areas of particular interest:

- Injection or cross-site scripting (XSS) through the generated signature HTML,
  including crafted `?share=` links, URLs, image and GIF fields, and font, color
  or size values that reach a `style` attribute.
- URL and protocol validation bypass (`javascript:`, `data:`, quote or markup
  characters inside URLs, private-network addresses).
- Rate-limit or CSRF bypass on the API endpoint.
- Weakening of the Content-Security-Policy in `src/proxy.ts`.
- Leakage of a configured AI provider key (`THEO_API_KEY` or `AI_API_KEY`).

## Supported versions

Only the latest release on the default branch (`main`) is actively supported.
Security fixes are backported to the most recent minor release when practical.
Older versions are not maintained; please upgrade.

## Security model

- Signature data is stored raw and escaped exactly once, at render time, in
  `src/lib/signature-html.ts`: text with `escapeHtml`, attribute values with
  `escapeAttr`, URLs with `validateUrl` (which percent-encodes quote and markup
  characters), and every style value is normalized first.
- Untrusted input (AI output, share links, saved drafts) is validated and
  sanitized before use. `/api/generate` also validates the signature it receives.
- Signature data is never persisted server-side.
- AI provider keys (`THEO_API_KEY`, `AI_API_KEY`) are server-only and only ever
  sent over https; never expose them via a `NEXT_PUBLIC_*` variable. The GIPHY
  key is intentionally public.
- Logs carry a provider's request id and error code, never a key or a visitor's
  text. A model reply that cannot be parsed is logged by length only.
- `src/proxy.ts` sets a Content-Security-Policy and enforces same-origin on API
  POST requests.

## Response process

- We will acknowledge your report within 3 business days.
- We will provide an initial assessment (confirmed / not a vulnerability /
  needs more information) within 10 business days, and keep you updated on
  progress toward a fix.
- We aim to ship a fix for confirmed vulnerabilities within 90 days, sooner for
  higher severity, and to coordinate public disclosure with you.
- Reporters are credited unless they ask to remain anonymous.

## Safe harbor

We consider security research and disclosure conducted in good faith to be
authorized. We will not pursue legal action against you for accessing our
systems or data only to the extent necessary to find and responsibly report a
vulnerability, provided you:

- avoid privacy violations, destruction of data, and interruption or
  degradation of our service;
- do not exploit a vulnerability beyond what is necessary to demonstrate it;
- report the issue promptly and privately.

This safe harbor does not cover activity against systems outside the SignForge
repository and its official deployment, or conduct inconsistent with these
conditions.
