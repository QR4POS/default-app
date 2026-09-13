"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/auth/actions";

export interface UserMenuProps {
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
}

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "?").trim();
  const parts = source.split(/[\s@]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function UserMenu({ email, name, avatarUrl, role }: UserMenuProps) {
  const displayName = name || email || "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-2 px-2" aria-label="Account">
          <Avatar className="size-7">
            <AvatarImage src={avatarUrl ?? undefined} alt="" />
            <AvatarFallback>{initials(name, email)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[10rem] truncate sm:inline-block">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate">{displayName}</span>
            {email ? (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {email}
              </span>
            ) : null}
            {role ? (
              <Badge variant="secondary" className="w-fit capitalize">
                {role}
              </Badge>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut className="size-4" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
