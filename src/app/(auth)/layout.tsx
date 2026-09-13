import Link from "next/link";
import { Boxes } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/lib/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Boxes className="size-5" />
          {siteConfig.name}
        </Link>
        <ModeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="pb-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {siteConfig.name}
      </footer>
    </div>
  );
}
