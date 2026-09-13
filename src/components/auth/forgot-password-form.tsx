"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { initialState } from "@/lib/auth/state";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
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
      <SubmitButton pendingText="Sending link...">
        Send reset link
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
