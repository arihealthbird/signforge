import { NextRequest, NextResponse } from "next/server";
import { sceneMediaOrigin } from "@/scenes/backdrop";

/**
 * Proxy for:
 * 1. A per-request Content-Security-Policy for all pages.
 * 2. CORS + CSRF enforcement for the JSON API routes.
 */

// Optional scene backdrop videos are served from a host-configured origin
// (NEXT_PUBLIC_SCENE_MEDIA_BASE). Unset by default, so nothing is allowed.
const mediaOrigin = sceneMediaOrigin();

const CSP = [
  "default-src 'self'",
  // Next.js hydration requires inline scripts.
  "script-src 'self' 'unsafe-inline'",
  // Every typeface is self-hosted, so there are no third-party style or font hosts.
  "style-src 'self' 'unsafe-inline'",
  // Signatures can embed any public HTTPS image the user pastes in, and the
  // GIF picker previews GIPHY media.
  "img-src 'self' https: data: blob:",
  "font-src 'self' data:",
  // The GIF picker talks to the GIPHY API straight from the browser.
  "connect-src 'self' https://api.giphy.com",
  `media-src 'self' blob:${mediaOrigin ? ` ${mediaOrigin}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function originMatchesHost(origin: string, request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = crypto.randomUUID();

  if (!isApiRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", CSP);
    response.headers.set("X-Request-ID", requestId);
    return response;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || "";

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (origin && originMatchesHost(origin, request)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      response.headers.set("Access-Control-Max-Age", "86400");
    }
    return response;
  }

  if (request.method === "POST") {
    if (!origin && !referer) {
      return NextResponse.json({ error: "Forbidden: missing origin" }, { status: 403 });
    }
    if (origin && !originMatchesHost(origin, request)) {
      return NextResponse.json({ error: "Forbidden: cross-origin request" }, { status: 403 });
    }
    if (!origin && referer) {
      try {
        if (new URL(referer).host !== host) {
          return NextResponse.json({ error: "Forbidden: cross-origin request" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Forbidden: invalid referer" }, { status: 403 });
      }
    }

    const response = NextResponse.next();
    if (origin) response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("X-Request-ID", requestId);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|fonts|images|brand).*)"],
};
