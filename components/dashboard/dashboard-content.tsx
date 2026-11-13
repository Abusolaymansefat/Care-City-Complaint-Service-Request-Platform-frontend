"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Bell, ClipboardList, FilePlus2, Wrench } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
import OperationsDashboard from "@/components/dashboard/operations-dashboard";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyComplaints } from "@/hooks/useComplaints";
import { useNotifications } from "@/hooks/useNotifications";
import { useMyPayments } from "@/hooks/usePayments";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

const shortcuts = [
  { label: "New complaint", description: "Report a city issue", href: "/citizen/complaints/create-poster", icon: FilePlus2 },
  { label: "Service requests", description: "Browse city services", href: "/citizen/service-requests", icon: Wrench },
  { label: "My complaints", description: "View your requests", href: "/citizen/complaints", icon: ClipboardList },
  { label: "Notices", description: "Latest updates", href: "/notifications", icon: Bell },
];

export default function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const mounted = useMounted();
  const isCitizen = mounted && user?.role === "CITIZEN";
  const recentComplaints = useMyComplaints({ page: 1, limit: 5 }, Boolean(isCitizen));
  const complaintTotal = useMyComplaints({ page: 1, limit: 1 }, Boolean(isCitizen));
  const inProgress = useMyComplaints(
    { page: 1, limit: 1, status: "IN_PROGRESS" },
    Boolean(isCitizen)
  );
  const resolved = useMyComplaints(
    { page: 1, limit: 1, status: "RESOLVED" },
    Boolean(isCitizen)
  );
  const payments = useMyPayments({ page: 1, limit: 4 }, Boolean(isCitizen));
  const notices = useNotifications({ page: 1, limit: 4 }, Boolean(isCitizen));

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full max-w-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (user?.role === "TECHNICIAN" || user?.role === "DEPARTMENT_OFFICER") {
    return <OperationsDashboard />;
  }

  if (!isCitizen) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ""}</h1>
          <p className="mt-1 text-muted-foreground">Your CityCare workspace is ready.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{user?.role.replaceAll("_", " ") ?? "Dashboard"}</CardTitle>
            <CardDescription>Use the navigation menu to access your account tools.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Total complaints", query: complaintTotal },
    { label: "In progress", query: inProgress },
    { label: "Resolved", query: resolved },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ""}</h1>
        <p className="mt-1 text-muted-foreground">
          Your city service requests and the latest notices, all in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, query }) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              {query.isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <CardTitle className="text-3xl">
                  {query.isError ? "—" : query.data?.meta?.total ?? 0}
                </CardTitle>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>

      <DashboardBarChart
        title="My complaint metrics"
        description="In-progress and resolved counts are included in the total."
        items={[
          { label: "All complaints", value: complaintTotal.data?.meta?.total ?? 0 },
          { label: "In progress", value: inProgress.data?.meta?.total ?? 0 },
          { label: "Resolved", value: resolved.data?.meta?.total ?? 0 },
        ]}
        isLoading={complaintTotal.isLoading || inProgress.isLoading || resolved.isLoading}
        isError={complaintTotal.isError || inProgress.isError || resolved.isError}
      />

      {stats.some(({ query }) => query.isError) && (
        <p role="alert" className="text-sm text-destructive">
          Complaint summary could not be loaded. Please refresh to try again.
        </p>
      )}

      <section aria-labelledby="citizen-quick-actions">
        <div className="mb-3">
          <h2 id="citizen-quick-actions" className="text-lg font-semibold">Quick actions</h2>
          <p className="text-sm text-muted-foreground">Start a request or find the information you need.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map(({ label, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardContent className="flex items-start justify-between gap-3 pt-5">
                  <span className="flex gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>My recent complaints</CardTitle>
              <CardDescription>Latest status of your submitted requests.</CardDescription>
            </div>
            <Link href="/citizen/complaints" className="shrink-0 text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentComplaints.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
              </div>
            ) : recentComplaints.isError ? (
              <p role="alert" className="text-sm text-destructive">Could not load complaints.</p>
            ) : !recentComplaints.data?.data.length ? (
              <p className="text-sm text-muted-foreground">No complaints yet. Use New complaint to get started.</p>
            ) : (
              <ul className="divide-y">
                {recentComplaints.data.data.map((complaint) => (
                  <li key={complaint.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <Link href={`/citizen/complaints/${complaint.id}`} className="block truncate text-sm font-medium hover:underline">
                        {complaint.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {complaint.trackingCode} · {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                    <ComplaintStatusBadge status={complaint.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Notices</CardTitle>
              <CardDescription>Recent updates from CityCare.</CardDescription>
            </div>
            <Link href="/notifications" className="shrink-0 text-sm text-primary hover:underline">
              All notices
            </Link>
          </CardHeader>
          <CardContent>
            {notices.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
              </div>
            ) : notices.isError ? (
              <p role="alert" className="text-sm text-destructive">Could not load notices.</p>
            ) : !notices.data?.data.length ? (
              <p className="text-sm text-muted-foreground">No notices yet. Updates will appear here.</p>
            ) : (
              <ul className="divide-y">
                {notices.data.data.map((notice) => (
                  <li key={notice.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium">{notice.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{notice.message}</p>
                    <time className="mt-2 block text-xs text-muted-foreground" dateTime={notice.createdAt}>
                      {format(new Date(notice.createdAt), "dd MMM yyyy, hh:mm a")}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>My recent payments</CardTitle>
            <CardDescription>Your complaint fees and bKash transaction statuses.</CardDescription>
          </div>
          <Link href="/payments" className="shrink-0 text-sm text-primary hover:underline">
            Payment history
          </Link>
        </CardHeader>
        <CardContent>
          {payments.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
            </div>
          ) : payments.isError ? (
            <p role="alert" className="text-sm text-destructive">Could not load your payments.</p>
          ) : !payments.data?.data.length ? (
            <p className="text-sm text-muted-foreground">
              Your payment transactions will appear here.
            </p>
          ) : (
            <ul className="divide-y">
              {payments.data.data.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link href={`/payments/${payment.id}`} className="block truncate text-sm font-medium hover:underline">
                      {payment.complaint?.title ?? payment.invoiceNumber}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {payment.currency} {Number(payment.amount).toFixed(2)} ·{" "}
                      {format(new Date(payment.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
