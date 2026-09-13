"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <CircleAlert className="size-10 text-destructive" />
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. Try again, or head back to safety.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
