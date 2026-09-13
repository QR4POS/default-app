import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="size-10 text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">
        This page could not be found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
