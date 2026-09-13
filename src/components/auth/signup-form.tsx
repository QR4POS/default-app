"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/lib/auth/actions";
import { initialState } from "@/lib/auth/state";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

export function SignUpForm({ next = "/" }: { next?: string }) {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <AuthMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
        />
      </div>
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
        />
      </div>
      <SubmitButton pendingText="Creating account...">
        Create account
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
