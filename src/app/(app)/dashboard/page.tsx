import { getSessionProfile } from "@/lib/supabase/queries";
import { getInitials } from "@/lib/name";
import { roleLabel } from "@/lib/auth/roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/site";

export default async function DashboardPage() {
  const session = await getSessionProfile();
  if (!session) {
    return null;
  }
  const { user, profile } = session;
  const name = profile?.full_name ?? user.user_metadata?.full_name ?? "there";
  const firstName = String(name).split(" ")[0];
  const joinedAt = user.created_at;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Good to see you, {firstName}
        </h1>
        <p className="text-muted-foreground">
          This is the authenticated shell of {siteConfig.name}. Clone it and
          start building.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Your session and public profile from the profiles table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage
                  src={profile?.avatar_url ?? undefined}
                  alt=""
                />
                <AvatarFallback>{getInitials(name, user.email)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{name}</p>
                  {profile?.role ? (
                    <Badge variant="secondary">
                      {roleLabel(profile.role)}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.email ?? "No email"}
                </p>
              </div>
            </div>
            <Separator />
            <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="mt-0.5 break-all font-mono text-xs">
                  {user.id}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="mt-0.5">
                  {joinedAt
                    ? new Date(joinedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                    : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>Making this your own app</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-4">
              <li>Rename the project in package.json and src/lib/site.ts.</li>
              <li>Add your Supabase credentials to .env.local.</li>
              <li>
                Enable Google in Auth → Providers and set your Site URL /
                redirect URLs.
              </li>
              <li>Push supabase/migrations to your project.</li>
              <li>Add features as route groups under src/app/(app)/.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
