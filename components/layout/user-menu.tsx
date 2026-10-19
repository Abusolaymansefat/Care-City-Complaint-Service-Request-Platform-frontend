"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };

  return (
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open user menu"
        className="rounded-full p-0"
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Button>
      <DropdownMenu placement="bottom end" className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onAction={() => router.push(user.role === "ADMIN" ? "/admin" : "/dashboard")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onAction={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}