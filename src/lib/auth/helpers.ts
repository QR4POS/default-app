/**
 * Route classification for the proxy session guard.
 * Everything not listed here requires an authenticated session.
 */

/** Public even when logged out (marketing + auth entry points). */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/update-password",
  "/auth",
] as const;

/** Pages that should bounce already-authenticated users away. */
export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"] as const;

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => route === "/" ? pathname === "/" : pathname.startsWith(route),
  );
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Safe target for post-auth redirects. Only allows in-app paths so a
 * `?next=` query param can never be abused for an open redirect.
 */
export function safeNextPath(path: string | undefined, fallback = "/"): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return fallback;
}
