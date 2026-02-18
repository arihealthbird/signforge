import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for:
 * 1. CSP nonce generation (all routes)
 * 2. CORS enforcement and CSRF protection (API routes)
 */

// ── CSP nonce generation ────────────────────────────────────────────

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  // btoa is available in Edge Runtime
  return btoa(String.fromCharCode(...array));
}

function buildCsp(nonce: string): string {
  // R2 public URL for img-src
  const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") || "";

  const directives = [
    "default-src 'self'",
    // Nonce-based script-src: modern browsers use nonce + strict-dynamic,
    // legacy browsers fall back to unsafe-inline (ignored when nonce is present)
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
    `img-src 'self' https://ui-avatars.com https://*.giphy.com https://giphy.com ${r2PublicUrl} data: blob:`.trim(),
    "font-src 'self' https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com",
    "connect-src 'self' https://api.giphy.com https://challenges.cloudflare.com",
    "media-src 'self' blob:",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  return directives.join("; ");
}

// ── CORS / CSRF helpers ─────────────────────────────────────────────

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function originMatchesHost(origin: string, request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

// ── Main middleware ─────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate a per-request CSP nonce
  const nonce = generateNonce();

  // Generate a unique request ID for traceability
  const requestId = crypto.randomUUID();

  // ── Non-API routes: apply CSP nonce header and pass through ──
  if (!isApiRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", buildCsp(nonce));
    // Expose nonce to server components via custom header
    response.headers.set("x-csp-nonce", nonce);
    response.headers.set("X-Request-ID", requestId);
    return response;
  }

  // ── API routes: CORS / CSRF enforcement ──

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (origin && originMatchesHost(origin, request)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Turnstile-Token");
      response.headers.set("Access-Control-Max-Age", "86400");
    }
    return response;
  }

  // For state-changing requests (POST), enforce origin check
  if (request.method === "POST") {
    if (!origin && !referer) {
      return NextResponse.json(
        { error: "Forbidden: missing origin" },
        { status: 403 }
      );
    }

    if (origin && !originMatchesHost(origin, request)) {
      return NextResponse.json(
        { error: "Forbidden: cross-origin request" },
        { status: 403 }
      );
    }

    if (!origin && referer) {
      try {
        const refererUrl = new URL(referer);
        const host = request.headers.get("host") || "";
        if (refererUrl.host !== host) {
          return NextResponse.json(
            { error: "Forbidden: cross-origin request" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Forbidden: invalid referer" },
          { status: 403 }
        );
      }
    }

    const response = NextResponse.next();
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes (CSP for pages, CORS/CSRF for API)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|fonts|images|videos|lottie).*)"],
};
