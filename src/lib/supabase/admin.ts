import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null = null;

/**
 * Service-role client. Bypasses RLS - SERVER ONLY.
 *
 * Lazily initialised so importing this module never crashes; the missing-key
 * error is raised (with a clear message) only when the client is first used.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (client) return client;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local (server-only; " +
        "never expose it to the browser).",
    );
  }

  client = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return client;
}
