"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePasswordAction } from "@/lib/auth/actions";
import { initialState } from "@/lib/auth/state";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <AuthMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
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
      <SubmitButton pendingText="Updating password...">
        Update password
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Go to dashboard
        </Link>
      </p>
    </form>
  );
}
