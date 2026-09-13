import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { isAuthRoute, isPublicRoute, safeNextPath } from "@/lib/auth/helpers";
import type { Database } from "@/types/database";

/**
 * Refreshes the Supabase auth session (if present) and guards routes.
 * Imported by the root `proxy.ts` file.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run code between createServerClient and auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Logged out.
  if (!user) {
    if (isPublicRoute(pathname)) {
      return supabaseResponse;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Logged in but visiting an auth-only page (login/signup/forgot).
  if (isAuthRoute(pathname)) {
    const next = request.nextUrl.searchParams.get("next") ?? undefined;
    const url = request.nextUrl.clone();
    url.pathname = safeNextPath(next, "/");
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
