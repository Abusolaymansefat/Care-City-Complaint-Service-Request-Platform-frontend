"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  CircleCheck,
  Clock3,
  CreditCard,
  FilePlus2,
  ClipboardList,
  Wrench,
} from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardTrendChart } from "@/components/dashboard/dashboard-trend-chart";
import { RecentNotificationsCard } from "@/components/dashboard/recent-notifications-card";
import {
  buildDailyCounts,
  buildTopCounts,
  DASHBOARD_RECORD_LIMIT,
} from "@/components/dashboard/dashboard-data";
import OperationsDashboard from "@/components/dashboard/operations-dashboard";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyComplaints } from "@/hooks/useComplaints";
import { useMyPayments } from "@/hooks/usePayments";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

const shortcuts = [
  { label: "Report an issue", description: "Submit a new city complaint", href: "/citizen/complaints/create-poster", icon: FilePlus2 },
  { label: "Service requests", description: "Browse available city services", href: "/citizen/service-requests", icon: Wrench },
  { label: "My complaints", description: "Track submitted requests", href: "/citizen/complaints", icon: ClipboardList },
  { label: "Payments", description: "Review your transactions", href: "/payments", icon: CreditCard },
];

export default function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const mounted = useMounted();
  const isCitizen = mounted && user?.role === "CITIZEN";
  const recentComplaints = useMyComplaints(
    { page: 1, limit: DASHBOARD_RECORD_LIMIT },
    Boolean(isCitizen),
  );
  const complaintTotal = useMyComplaints({ page: 1, limit: 1 }, Boolean(isCitizen));
  const submitted = useMyComplaints(
    { page: 1, limit: 1, status: "SUBMITTED" },
    Boolean(isCitizen),
  );
  const inProgress = useMyComplaints(
    { page: 1, limit: 1, status: "IN_PROGRESS" },
    Boolean(isCitizen),
  );
  const resolved = useMyComplaints(
    { page: 1, limit: 1, status: "RESOLVED" },
    Boolean(isCitizen),
  );
  const payments = useMyPayments({ page: 1, limit: 4 }, Boolean(isCitizen));

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (user?.role === "TECHNICIAN" || user?.role === "DEPARTMENT_OFFICER") {
    return <OperationsDashboard />;
  }

  if (!isCitizen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard unavailable</CardTitle>
          <CardDescription>This dashboard is not configured for your account role.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const complaintRows = recentComplaints.data?.data ?? [];
  const categoryCounts = buildTopCounts(complaintRows, (complaint) => complaint.category?.name);
  const dailyCounts = buildDailyCounts(complaintRows, (complaint) => complaint.createdAt);
  const stats = [
    {
      label: "Total complaints",
      value: complaintTotal.data?.meta?.total,
      hint: "All requests submitted",
      icon: ClipboardList,
      tone: "blue" as const,
      isLoading: complaintTotal.isLoading,
      isError: complaintTotal.isError,
    },
    {
      label: "Submitted",
      value: submitted.data?.meta?.total,
      hint: "Waiting for review",
      icon: Clock3,
      tone: "amber" as const,
      isLoading: submitted.isLoading,
      isError: submitted.isError,
    },
    {
      label: "In progress",
      value: inProgress.data?.meta?.total,
      hint: "Being handled by the city",
      icon: Wrench,
      tone: "cyan" as const,
      isLoading: inProgress.isLoading,
      isError: inProgress.isError,
    },
    {
      label: "Resolved",
      value: resolved.data?.meta?.total,
      hint: "Requests marked resolved",
      icon: CircleCheck,
      tone: "green" as const,
      isLoading: resolved.isLoading,
      isError: resolved.isError,
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-linear-to-r from-[#0849a0] via-[#1264d8] to-[#3196e8] p-5 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-sm font-medium text-blue-100">Citizen overview</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome{user ? `, ${user.name}` : ""}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-blue-50/90">
            Follow your city requests, get notified when something changes, and find services in one place.
          </p>
        </div>
        <Link
          href="/citizen/complaints/create-poster"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#0849a0] shadow-sm transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <FilePlus2 className="size-4" aria-hidden="true" />
          Report an issue
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardMetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <section aria-label="Complaint activity and categories" className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <DashboardTrendChart
          title="Complaint activity"
          description={`Daily submissions from your latest ${DASHBOARD_RECORD_LIMIT} requests.`}
          data={dailyCounts}
          isLoading={recentComplaints.isLoading}
          isError={recentComplaints.isError}
        />
        <DashboardBarChart
          title="Requests by category"
          description={`Category distribution in your latest ${DASHBOARD_RECORD_LIMIT} requests.`}
          items={categoryCounts}
          isLoading={recentComplaints.isLoading}
          isError={recentComplaints.isError}
        />
      </section>

      <section aria-labelledby="citizen-quick-actions">
        <div className="mb-3">
          <h2 id="citizen-quick-actions" className="text-lg font-semibold">Quick actions</h2>
          <p className="text-sm text-muted-foreground">Jump to the services you use most.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map(({ label, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full border-0 bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-card dark:ring-border">
                <CardContent className="flex items-start justify-between gap-3 pt-5">
                  <span className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-700"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Recent complaints and notifications" className="grid gap-4 xl:grid-cols-2">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Recent complaints</CardTitle>
              <CardDescription>Latest status of your submitted requests.</CardDescription>
            </div>
            <Link href="/citizen/complaints" className="shrink-0 text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
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
            ) : !complaintRows.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No complaints yet. Report an issue to get started.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-border">
                {complaintRows.slice(0, 5).map((complaint) => (
                  <li key={complaint.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <Link href={`/citizen/complaints/${complaint.id}`} className="block truncate text-sm font-medium hover:text-blue-700 hover:underline">
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

        <RecentNotificationsCard enabled={Boolean(isCitizen)} />
      </section>

      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Recent payments</CardTitle>
            <CardDescription>Complaint fees and transaction status.</CardDescription>
          </div>
          <Link href="/payments" className="shrink-0 text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
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
            <p className="py-5 text-center text-sm text-muted-foreground">
              Your payment transactions will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-border">
              {payments.data.data.map((payment) => (
                <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <Link href={`/payments/${payment.id}`} className="block truncate text-sm font-medium hover:text-blue-700 hover:underline">
                      {payment.complaint?.title ?? payment.invoiceNumber}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {payment.currency} {Number(payment.amount).toFixed(2)} · {format(new Date(payment.createdAt), "dd MMM yyyy")}
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
