"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import {
  deleteNotification,
  fetchMyNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notifications";
import type { NotificationQuery } from "@/types";

const notificationKeys = {
  all: ["notifications"] as const,
  list: (query: NotificationQuery) => ["notifications", "list", query] as const,
  unread: ["notifications", "unread-count"] as const,
};

export const useNotifications = (query: NotificationQuery) =>
  useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: () => fetchMyNotifications(query),
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unread,
    queryFn: fetchUnreadCount,
    refetchInterval: 60_000,
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("All notifications marked as read.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Notification deleted.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};
