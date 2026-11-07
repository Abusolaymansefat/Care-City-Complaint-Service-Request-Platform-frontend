"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { BellOff, CheckCheck, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteNotification,
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeLabels: Record<NotificationType, string> = {
  GENERAL: "General",
  COMPLAINT_CREATED: "Complaint",
  COMPLAINT_STATUS_CHANGED: "Status",
  ASSIGNMENT_CREATED: "Assignment",
  ASSIGNMENT_STATUS_CHANGED: "Assignment",
  PAYMENT_INITIATED: "Payment",
  PAYMENT_PAID: "Payment",
  PAYMENT_FAILED: "Payment",
  FEEDBACK_SUBMITTED: "Feedback",
};

export default function NotificationList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications({ page, limit: 10 });
  const markAll = useMarkAllAsRead();
  const markOne = useMarkAsRead();
  const remove = useDeleteNotification();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const notifications = data?.data ?? [];
  const meta = data?.meta;

  if (!notifications.length) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <BellOff className="mx-auto mb-2 size-8 text-muted-foreground" />
          <CardTitle>No notifications</CardTitle>
          <CardDescription>Updates about your complaints will appear here.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          isDisabled={markAll.isPending}
          onPress={() => markAll.mutate()}
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="grid gap-3">
        {notifications.map((item) => (
          <Card key={item.id} className={cn(!item.isRead && "border-primary/40 bg-muted/30")}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!item.isRead && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                  <CardTitle className="truncate text-base">{item.title}</CardTitle>
                </div>
                <CardDescription className="mt-1 line-clamp-3">{item.message}</CardDescription>
              </div>
              <Badge variant="outline">{typeLabels[item.type]}</Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
              <div className="flex gap-2">
                {item.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push(item.link as string)}
                  >
                    Open
                  </Button>
                )}
                {!item.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    isDisabled={markOne.isPending}
                    onPress={() => markOne.mutate(item.id)}
                  >
                    <Check className="h-4 w-4" />
                    Mark read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete notification"
                  isDisabled={remove.isPending}
                  onPress={() => remove.mutate(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            isDisabled={page <= 1}
            onPress={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            isDisabled={page >= meta.totalPages}
            onPress={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
