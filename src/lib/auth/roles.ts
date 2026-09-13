/**
 * Application roles. Keep in sync with the `profiles_role_check` constraint
 * in supabase/migrations/20260102000000_roles_and_admin.sql.
 */
export const USER_ROLES = ["user", "admin", "super_admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  admin: "Admin",
  super_admin: "Super admin",
};

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

/** Coerces an unknown DB value to a known role, defaulting to "user". */
export function normalizeRole(value: string | null | undefined): UserRole {
  return isUserRole(value) ? value : "user";
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return role === "super_admin";
}

export function roleLabel(value: string | null | undefined): string {
  return ROLE_LABELS[normalizeRole(value)];
}
