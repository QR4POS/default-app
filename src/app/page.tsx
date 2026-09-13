import Link from "next/link";
import { ArrowRight, Boxes, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/lib/site";

const FEATURES = [
  {
    title: "Next.js 16 + App Router",
    description:
      "TypeScript, Tailwind CSS v4 and the latest React. Proxy-based route protection included.",
  },
  {
    title: "Supabase Auth, wired",
    description:
      "Email/password, magic reset links and Google OAuth using @supabase/ssr - cookies, refresh and all.",
  },
  {
    title: "Row-level security ready",
    description:
      "A profiles table, handle_new_user trigger and RLS policies ship as a migration you can push instantly.",
  },
  {
    title: "shadcn/ui components",
    description:
      "Cards, forms, dropdowns and toasts you can compose into any interface in minutes.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Boxes className="size-5" />
            {siteConfig.name}
          </Link>
          <nav className="flex items-center gap-2">
            <ModeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Sparkles className="size-3" />
            Default starter template
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Ship your next app, not your auth boilerplate.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            {siteConfig.description} Clone it, point it at a fresh Supabase
            project, and start building features on day one.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Get started
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-5 text-left"
              >
                <h3 className="font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3" />
              Auth included
            </span>
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
