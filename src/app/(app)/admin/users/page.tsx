import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin, normalizeRole } from "@/lib/auth/roles";
import { getInitials } from "@/lib/name";
import { RoleSelect } from "@/components/admin/role-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Users & roles",
};

export default async function AdminUsersPage() {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }
  if (!isSuperAdmin(session.profile?.role)) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const profiles = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Users & roles</h1>
        <p className="text-muted-foreground">
          Manage who can access and administer the app. The first user is a
          super admin; the last super admin cannot be demoted.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            {profiles.length} {profiles.length === 1 ? "user" : "users"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => {
                  const isSelf = profile.id === session.user.id;
                  return (
                    <tr key={profile.id} className="border-b last:border-0">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={profile.avatar_url ?? undefined}
                              alt=""
                            />
                            <AvatarFallback>
                              {getInitials(profile.full_name, profile.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium">
                                {profile.full_name || "Unnamed user"}
                              </span>
                              {isSelf ? (
                                <Badge variant="outline">You</Badge>
                              ) : null}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {profile.email ?? "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <RoleSelect
                          userId={profile.id}
                          role={normalizeRole(profile.role)}
                          disabled={isSelf}
                        />
                      </td>
                    </tr>
                  );
                })}
                {profiles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No users yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
