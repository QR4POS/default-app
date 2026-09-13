import Link from "next/link";
import { redirect } from "next/navigation";
import { Boxes } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { getSessionProfile } from "@/lib/supabase/queries";
import { ModeToggle } from "@/components/mode-toggle";
import { UserMenu } from "@/components/user-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The proxy also guards this area; this keeps the layout safe if the
  // session expired between requests.
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }

  const { user, profile } = session;
  const metadata = user.user_metadata as Record<string, unknown> | undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <Boxes className="size-5" />
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserMenu
              email={user.email}
              name={
                (metadata?.full_name as string | undefined) ??
                profile?.full_name
              }
              avatarUrl={
                (metadata?.avatar_url as string | undefined) ??
                profile?.avatar_url
              }
              role={profile?.role}
            />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {siteConfig.name}
      </footer>
    </div>
  );
}
