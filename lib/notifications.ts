import { api } from "@/lib/api";
import type { Notification, NotificationQuery, PaginationMeta } from "@/types";

type ApiListResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};

export const fetchMyNotifications = async (params: NotificationQuery) => {
  const res = await api.get<ApiListResponse<Notification[]>>("/notifications/get-my-notifications", {
    params,
  });
  return { data: res.data.data, meta: res.data.meta };
};

export const fetchUnreadCount = async () => {
  const res = await api.get<{ data: { count: number } }>("/notifications/get-unread-count");
  return res.data.data.count;
};

export const markNotificationAsRead = async (id: string) => {
  const res = await api.patch<{ data: Notification }>(`/notifications/mark-as-read/${id}`);
  return res.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.patch<{ data: { success: boolean } }>("/notifications/mark-all-as-read");
  return res.data.data;
};

export const deleteNotification = async (id: string) => {
  const res = await api.delete<{ data: { success: boolean } }>(`/notifications/delete-notification/${id}`);
  return res.data.data;
};
