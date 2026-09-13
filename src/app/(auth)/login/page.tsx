import { AuthCard } from "@/components/auth/auth-card";
import { AuthMessage } from "@/components/auth/auth-message";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_missing_code: "The sign-in link was invalid. Please try again.",
  auth_callback_failed:
    "We couldn't complete your sign-in. Please try again or contact support.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/dashboard", error } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <div className="space-y-4">
        {error ? <AuthMessage state={{ error: ERROR_MESSAGES[error] ?? error }} /> : null}
        <OAuthButtons next={next} />
        <LoginForm next={next} />
      </div>
    </AuthCard>
  );
}
