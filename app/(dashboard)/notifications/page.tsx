import NotificationList from "@/components/notifications/notification-list";
import { BellRing } from "lucide-react";

export const instant = false;

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-linear-to-r from-[#0849a0] via-[#1264d8] to-[#3196e8] p-5 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <BellRing className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-blue-100">CityCare updates</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Notifications</h2>
            <p className="mt-2 text-sm text-blue-50/90">
              Stay updated on your complaints, payments, and assignments.
            </p>
          </div>
        </div>
        <p className="text-xs font-medium text-blue-100">
          Automatically refreshed every minute
        </p>
      </section>
      <NotificationList />
    </div>
  );
}
