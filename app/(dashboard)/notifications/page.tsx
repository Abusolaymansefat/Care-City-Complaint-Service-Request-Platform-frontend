import NotificationList from "@/components/notifications/notification-list";

export const instant = false;

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stay updated on your complaints, payments, and assignments.
        </p>
      </div>

      <NotificationList />
    </div>
  );
}
