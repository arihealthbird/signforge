/**
 * A failed call to an AI provider. `status` is the HTTP status, or 0 when the
 * provider could not be reached. `code` and `requestId` are whatever the
 * provider reported, which is what its support team asks for.
 *
 * Every provider client throws this (or a subclass), so `toServiceError` in
 * `ai.ts` can map a failure from any of them onto the route's error codes.
 * Neither the message nor the fields ever carry the API key.
 */
export class ProviderError extends Error {
  /** A short label for logs: `theo` or `custom`. */
  readonly provider: string;
  readonly status: number;
  readonly code: string | null;
  readonly requestId: string | null;

  constructor(
    provider: string,
    status: number,
    code: string | null,
    requestId: string | null,
    message?: string
  ) {
    super(message ?? `${provider} API error ${status}${code ? ` (${code})` : ""}`);
    this.name = "ProviderError";
    this.provider = provider;
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}
