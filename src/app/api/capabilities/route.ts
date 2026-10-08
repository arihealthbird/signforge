import { NextResponse } from "next/server";
import { getCapabilities } from "@/lib/ai-provider";

// Read on every request. A self-hosted container receives its keys at runtime,
// so the answer cannot be decided once at build time.
export const dynamic = "force-dynamic";

/**
 * Which optional composer features this deployment can serve, so the browser
 * offers only those. It reveals two booleans and nothing about the provider.
 */
export function GET() {
  return NextResponse.json(getCapabilities(), { headers: { "Cache-Control": "no-store" } });
}
