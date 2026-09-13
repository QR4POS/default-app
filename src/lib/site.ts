import { siteUrl } from "@/lib/env";

export const siteConfig = {
  name: "DefaultApp",
  description:
    "A Next.js + Supabase starter with authentication, ready to clone for any new project.",
  /**
   * Public base URL, used to build OAuth / email redirect URLs. Client-safe:
   * NEXT_PUBLIC_SITE_URL is inlined at build time, so set it per deployment
   * (e.g. https://app.example.com). Falls back to localhost for local dev.
   */
  url: siteUrl,
} as const;

export type SiteConfig = typeof siteConfig;
