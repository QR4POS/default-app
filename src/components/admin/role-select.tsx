"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/admin/actions";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/auth/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RoleSelect({
  userId,
  role,
  disabled = false,
}: {
  userId: string;
  role: UserRole;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<UserRole>(role);
  const [pending, startTransition] = useTransition();

  const onChange = (next: string) => {
    if (next === value) return;
    const previous = value;
    setValue(next as UserRole);

    startTransition(async () => {
      const result = await updateUserRole(userId, next);
      if (result.error) {
        toast.error(result.error);
        setValue(previous);
      } else {
        toast.success(result.success ?? "Role updated.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || pending}
      >
        <SelectTrigger className="w-40" aria-label="Change role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {USER_ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {ROLE_LABELS[r]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pending ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : null}
    </div>
  );
}
