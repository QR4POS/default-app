"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/lib/auth/actions";
import { initialState } from "@/lib/auth/state";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

export function LoginForm({ next = "/" }: { next?: string }) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <AuthMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>
      <SubmitButton pendingText="Signing in...">Sign in</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
