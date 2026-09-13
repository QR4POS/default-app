import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/signup-form";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/dashboard" } = await searchParams;

  return (
    <AuthCard
      title="Create an account"
      description="Start building something great"
    >
      <SignUpForm next={next} />
    </AuthCard>
  );
}
