import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/helpers";
import { siteConfig } from "@/lib/site";

/**
 * OAuth / email link callback.
 * Exchanges the `code` for a session and redirects to the `next` target.
 * Handles: email confirmation, magic links, Google sign-in, password reset.
 *
 * Redirect targets are always built from NEXT_PUBLIC_SITE_URL (never from
 * request headers) to avoid open-redirect / host-header spoofing.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next") ?? undefined, "/");

  const loginUrl = new URL("/login", siteConfig.url);

  if (!code) {
    loginUrl.searchParams.set("error", "auth_callback_missing_code");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback]", error.message);
    loginUrl.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, siteConfig.url));
}
