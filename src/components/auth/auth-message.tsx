import { CircleAlert, CircleCheck } from "lucide-react";
import type { AuthActionState } from "@/lib/auth/state";

export function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        <span>{state.error}</span>
      </div>
    );
  }

  if (state.success) {
    return (
      <div
        role="status"
        className="flex items-start gap-2 rounded-md border border-emerald-600/30 bg-emerald-600/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
      >
        <CircleCheck className="mt-0.5 size-4 shrink-0" />
        <span>{state.success}</span>
      </div>
    );
  }

  return null;
}
