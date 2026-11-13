"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";

export function RecentNotificationsCard({ enabled = true }: { enabled?: boolean }) {
  const { data, isLoading, isError } = useNotifications({ page: 1, limit: 4 }, enabled);
  const notifications = data?.data ?? [];

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Recent notifications</CardTitle>
          <CardDescription>Updates for your account.</CardDescription>
        </div>
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline dark:text-blue-300"
        >
          View all <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
          </div>
        ) : isError ? (
          <p role="alert" className="text-sm text-destructive">
            Notifications could not be loaded.
          </p>
        ) : !notifications.length ? (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-muted-foreground dark:bg-muted/50">
            <Bell className="size-4 shrink-0" aria-hidden="true" />
            You are all caught up.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-border">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <Link
                  href={notification.link ?? "/notifications"}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${
                      notification.isRead ? "bg-slate-300" : "bg-blue-600"
                    }`}
                    aria-label={notification.isRead ? "Read" : "Unread"}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{notification.title}</span>
                    <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
                      {notification.message}
                    </span>
                    <time
                      className="mt-1.5 block text-[11px] text-slate-400"
                      dateTime={notification.createdAt}
                    >
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
