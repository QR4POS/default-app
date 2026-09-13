"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/queries";
import { isUserRole } from "@/lib/auth/roles";

export type RoleUpdateResult = {
  error?: string;
  success?: string;
};

/**
 * Change another user's role. Super admins only.
 *
 * Authorization is enforced twice: here (app logic) and by the
 * "Super admins can update any profile" RLS policy. A DB trigger additionally
 * prevents demoting the last remaining super admin.
 */
export async function updateUserRole(
  userId: string,
  role: string,
): Promise<RoleUpdateResult> {
  const session = await getSessionProfile();
  if (!session) {
    return { error: "You must be signed in." };
  }
  if (session.profile?.role !== "super_admin") {
    return { error: "Only super admins can change roles." };
  }

  const targetId = String(userId ?? "").trim();
  const nextRole = String(role ?? "").trim();

  if (!targetId) {
    return { error: "Missing user." };
  }
  if (!isUserRole(nextRole)) {
    return { error: "Invalid role." };
  }
  if (targetId === session.user.id) {
    return { error: "You cannot change your own role." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: nextRole })
    .eq("id", targetId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: "Role updated." };
}
