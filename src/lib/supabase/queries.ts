import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

export interface SessionProfile {
  user: User;
  profile: Profile | null;
}

/**
 * Fetches the authenticated user and their public profile row in one pass.
 * Server-only.
 */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: data };
}

/** Returns the authenticated Supabase user, or null. Server-only. */
export async function getCurrentUser() {
  const result = await getSessionProfile();
  return result?.user ?? null;
}

/** Returns the caller's own public profile row, or null. Server-only. */
export async function getOwnProfile() {
  const result = await getSessionProfile();
  return result?.profile ?? null;
}
