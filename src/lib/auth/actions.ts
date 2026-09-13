"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";
import { safeNextPath } from "@/lib/auth/helpers";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import type { AuthActionState } from "@/lib/auth/state";

function authUrl(nextPath: string) {
  return `${siteConfig.url}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

function read(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = read(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(read(formData, "next"), "/");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(next);
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = read(formData, "email");
  const password = String(formData.get("password") ?? "");
  const fullName = read(formData, "full_name");
  const next = safeNextPath(read(formData, "next"), "/");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authUrl(next),
      data: { full_name: fullName || null },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // When "Confirm email" is disabled in Supabase Auth settings the user is
  // signed in immediately; otherwise they must click the emailed link.
  if (!data.session) {
    return {
      success:
        "Almost done - check your inbox for a confirmation link to activate your account.",
    };
  }

  redirect(next);
}

export async function forgotPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = read(formData, "email");

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authUrl("/update-password"),
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Password is required." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
