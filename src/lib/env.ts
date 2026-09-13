import { z } from "zod";

/**
 * Validates the public (browser-safe) environment variables at module load so
 * misconfiguration fails loudly instead of producing cryptic runtime errors.
 *
 * Server-only secrets (e.g. SUPABASE_SERVICE_ROLE_KEY) are validated where
 * they are used - see src/lib/supabase/admin.ts.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .optional(),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Invalid public environment variables:\n${issues}\n\n` +
      "Copy .env.example to .env.local and fill in your Supabase values.",
  );
}

export const env = parsed.data;

export const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
