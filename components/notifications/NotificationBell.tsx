"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllAsRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: unread } = useUnreadCount();
  const { data, isLoading } = useNotifications({ page: 1, limit: 6 });
  const markAll = useMarkAllAsRead();

  const count = unread ?? 0;
  const notifications = data?.data ?? [];

  return (
    <DropdownMenuTrigger isOpen={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative rounded-full"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Button>
      <DropdownMenu placement="bottom end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {count > 0 && (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-normal text-primary hover:underline disabled:opacity-50"
              disabled={markAll.isPending}
              onClick={() => markAll.mutate()}
            >
              {markAll.isPending ? (
                <LoaderCircle className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            You have no notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onAction={() => {
                setOpen(false);
                router.push(item.link ?? "/notifications");
              }}
              className={cn("flex flex-col items-start gap-1 py-2", !item.isRead && "bg-muted/50")}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                {!item.isRead && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                {item.title}
              </span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{item.message}</span>
              <span className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onAction={() => router.push("/notifications")}>
          <Link href="/notifications" className="w-full text-center text-sm text-primary">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
