import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for CORS enforcement and CSRF protection on API routes.
 *
 * - Rejects cross-origin POST requests to /api/* unless the Origin matches the app's own host.
 * - Handles OPTIONS preflight requests.
 * - Requires Origin or Referer header on all state-changing (POST) requests to /api/*.
 */

function getAllowedOrigin(request: NextRequest): string {
  // In production, use the actual host. In development, allow localhost.
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function originMatchesHost(origin: string, request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  try {
    const originUrl = new URL(origin);
    // Compare hostname and port (handles localhost:3018 etc.)
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to API routes
  if (!isApiRoute(pathname)) {
    return NextResponse.next();
  }

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
    // Must have Origin or Referer header (CSRF protection)
    if (!origin && !referer) {
      return NextResponse.json(
        { error: "Forbidden: missing origin" },
        { status: 403 }
      );
    }

    // If Origin is present, it must match our host
    if (origin && !originMatchesHost(origin, request)) {
      return NextResponse.json(
        { error: "Forbidden: cross-origin request" },
        { status: 403 }
      );
    }

    // If only Referer is present (no Origin), verify it matches
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

    // Add CORS headers to the response
    const response = NextResponse.next();
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
