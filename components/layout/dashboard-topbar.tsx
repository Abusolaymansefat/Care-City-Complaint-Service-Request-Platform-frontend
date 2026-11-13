"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { navByRole } from "@/config/nav";
import { useMounted } from "@/hooks/useMounted";
import { getInitials } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardTopbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const mounted = useMounted();
  const navItems = mounted && user
    ? navByRole[user.role].flatMap((group) => group.items)
    : [];
  const pageTitle = navItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length)[0]?.title ?? "Overview";

  return (
    <header className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl dark:border-border dark:bg-background/90 md:px-6">
      <SidebarTrigger className="rounded-xl text-slate-600 dark:text-foreground" />
      <Separator orientation="vertical" className="h-7" />
      <div className="min-w-0">
        <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
          CityCare workspace
        </p>
        <h1 className="truncate text-base font-semibold text-slate-900 dark:text-foreground">
          {pageTitle}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <NotificationBell />
        <ThemeToggle />
        {mounted && user && (
          <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 dark:border-border sm:flex">
            <Avatar className="size-9 ring-2 ring-blue-100 dark:ring-blue-900">
              <AvatarImage src={user.imageUrl ?? undefined} alt={`${user.name}'s profile`} />
              <AvatarFallback className="bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-40">
              <p className="truncate text-sm font-semibold leading-tight">{user.name}</p>
              <p className="truncate text-[11px] capitalize text-muted-foreground">
                {user.role.toLowerCase().replaceAll("_", " ")}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
