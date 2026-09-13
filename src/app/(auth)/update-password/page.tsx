import { AuthCard } from "@/components/auth/auth-card";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <AuthCard
      title="Choose a new password"
      description="Your password was verified - set a new one below"
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}
