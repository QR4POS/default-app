import type { Metadata } from "next";
import { getSessionProfile } from "@/lib/supabase/queries";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getSessionProfile();
  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account. Add more sections as your app grows.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Update the password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
