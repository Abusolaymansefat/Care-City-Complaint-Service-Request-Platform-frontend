"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import {
  CircleCheck,
  ClipboardList,
  Clock3,
  CreditCard,
  Users,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaints } from "@/hooks/useComplaints";
import { useAdminPaymentStats, useAdminPayments } from "@/hooks/usePayments";
import { useAuthStore } from "@/store/auth.store";
import { useMounted } from "@/hooks/useMounted";
import type { PaymentPeriod } from "@/types";

const periodLabels: Record<PaymentPeriod, string> = {
  all: "All time",
  "7d": "Last 7 days",
  "1m": "Last month",
  "1y": "Last year",
};

export default function AdminDashboard() {
  const [period, setPeriod] = useState<PaymentPeriod>("7d");
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const complaints = useComplaints(
    { page: 1, limit: DASHBOARD_RECORD_LIMIT },
    mounted,
  );
  const complaintTotal = useComplaints({ page: 1, limit: 1 }, mounted);
  const inProgressComplaints = useComplaints(
    { page: 1, limit: 1, status: "IN_PROGRESS" },
    mounted,
  );
  const resolvedComplaints = useComplaints(
    { page: 1, limit: 1, status: "RESOLVED" },
    mounted,
  );
  const closedComplaints = useComplaints(
    { page: 1, limit: 1, status: "CLOSED" },
    mounted,
  );
  const rejectedComplaints = useComplaints(
    { page: 1, limit: 1, status: "REJECTED" },
    mounted,
  );
  const cancelledComplaints = useComplaints(
    { page: 1, limit: 1, status: "CANCELLED" },
    mounted,
  );
  const payments = useAdminPayments({ page: 1, limit: 1, period }, mounted);
  const paymentStats = useAdminPaymentStats(period);
  const complaintRows = complaints.data?.data ?? [];
  const totalComplaintCount = complaintTotal.data?.meta?.total ?? 0;
  const inProgressCount = inProgressComplaints.data?.meta?.total ?? 0;
  const resolvedCount = resolvedComplaints.data?.meta?.total ?? 0;
  const closedCount = closedComplaints.data?.meta?.total ?? 0;
  const rejectedCount = rejectedComplaints.data?.meta?.total ?? 0;
  const cancelledCount = cancelledComplaints.data?.meta?.total ?? 0;
  const openCount = Math.max(
    0,
    totalComplaintCount - resolvedCount - closedCount - rejectedCount - cancelledCount,
  );
  const dailyCounts = buildDailyCounts(complaintRows, (complaint) => complaint.createdAt);
  const categoryCounts = buildTopCounts(complaintRows, (complaint) => complaint.category?.name);
  const stats = [
    {
      label: "Total complaints",
      value: totalComplaintCount,
      hint: "Across all departments",
      icon: ClipboardList,
      tone: "blue" as const,
      isLoading: complaintTotal.isLoading,
      isError: complaintTotal.isError,
    },
    {
      label: "Pending / open",
      value: openCount,
      hint: "Awaiting completion",
      icon: Clock3,
      tone: "amber" as const,
      isLoading:
        complaintTotal.isLoading ||
        resolvedComplaints.isLoading ||
        closedComplaints.isLoading ||
        rejectedComplaints.isLoading ||
        cancelledComplaints.isLoading,
      isError:
        complaintTotal.isError ||
        resolvedComplaints.isError ||
        closedComplaints.isError ||
        rejectedComplaints.isError ||
        cancelledComplaints.isError,
    },
    {
      label: "In progress",
      value: inProgressCount,
      hint: "Currently being handled",
      icon: Wrench,
      tone: "cyan" as const,
      isLoading: inProgressComplaints.isLoading,
      isError: inProgressComplaints.isError,
    },
    {
      label: "Resolved or closed",
      value: resolvedCount + closedCount,
      hint: "Completed complaints",
      icon: CircleCheck,
      tone: "green" as const,
      isLoading: resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: resolvedComplaints.isError || closedComplaints.isError,
    },
  ];
  const isError = [
    complaints,
    complaintTotal,
    inProgressComplaints,
    resolvedComplaints,
    closedComplaints,
    rejectedComplaints,
    cancelledComplaints,
    payments,
    paymentStats,
  ].some((query) => query.isError);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-linear-to-r from-[#0849a0] via-[#1264d8] to-[#3196e8] p-5 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-sm font-medium text-blue-100">CityCare administration</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome{user ? `, ${user.name}` : ""}
          </h2>
          <p className="mt-2 text-sm text-blue-50/90">
            Monitor complaints, payments, and service performance across the city.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/complaints"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#0849a0] shadow-sm transition hover:bg-blue-50"
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            Complaints
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Users className="size-4" aria-hidden="true" />
            Manage users
          </Link>
        </div>
      </section>

      {isError && (
        <Card role="alert" className="border-0 shadow-sm ring-1 ring-amber-200 dark:ring-amber-900">
          <CardHeader>
            <CardTitle>Some dashboard data could not be loaded</CardTitle>
            <CardDescription>Other panels remain available. Refresh to retry the missing data.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <DashboardMetricCard key={stat.label} {...stat} />)}
      </div>

      <Card className="overflow-visible border-0 bg-linear-to-r from-blue-50 via-white to-cyan-50 shadow-sm ring-1 ring-blue-100 dark:from-blue-950/40 dark:via-card dark:to-cyan-950/30 dark:ring-border">
        <CardContent className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div>
            <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground">
              Payments collected · {periodLabels[period]}
            </p>
            {paymentStats.isLoading ? (
              <Skeleton className="mt-2 h-9 w-40" />
            ) : (
              <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground">
                {paymentStats.isError
                  ? "—"
                  : `BDT ${Number(paymentStats.data?.totalAmount ?? 0).toFixed(2)}`}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {paymentStats.isError ? "Payment totals unavailable." : `${paymentStats.data?.paidCount ?? 0} successful payments`}
            </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="admin-payment-period" className="text-xs font-medium text-muted-foreground">
              Revenue period
            </label>
            <select
              id="admin-payment-period"
              className="h-10 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-border dark:bg-card"
              value={period}
              onChange={(event) => setPeriod(event.target.value as PaymentPeriod)}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="1m">Last month</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <section aria-label="Complaint activity and categories" className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <DashboardTrendChart
          title="Complaint activity"
          description={`Daily submissions from the latest ${DASHBOARD_RECORD_LIMIT} complaints.`}
          data={dailyCounts}
          isLoading={complaints.isLoading}
          isError={complaints.isError}
        />
        <DashboardBarChart
          title="Complaints by category"
          description={`Category distribution in the latest ${DASHBOARD_RECORD_LIMIT} complaints.`}
          items={categoryCounts}
          isLoading={complaints.isLoading}
          isError={complaints.isError}
        />
      </section>

      <section aria-label="Recent complaints and notifications" className="grid gap-4 xl:grid-cols-2">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Recent complaints</CardTitle>
              <CardDescription>Latest requests submitted across the city.</CardDescription>
            </div>
            <Link href="/admin/complaints" className="shrink-0 text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {complaints.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
              </div>
            ) : complaints.isError ? (
              <p role="alert" className="text-sm text-destructive">Complaint activity is temporarily unavailable.</p>
            ) : !complaintRows.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No complaints have been submitted yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-border">
                {complaintRows.slice(0, 5).map((complaint) => (
                  <li key={complaint.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{complaint.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {complaint.trackingCode} · {complaint.department?.name ?? "Unassigned"} · {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                    <ComplaintStatusBadge status={complaint.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <RecentNotificationsCard enabled={mounted} />
      </section>

      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Payment activity</CardTitle>
            <CardDescription>Transactions recorded during {periodLabels[period].toLowerCase()}.</CardDescription>
          </div>
          <Link href="/admin/payments" className="shrink-0 text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
            View payments
          </Link>
        </CardHeader>
        <CardContent>
          {payments.isLoading ? (
            <Skeleton className="h-14 w-full" />
          ) : payments.isError ? (
            <p role="alert" className="text-sm text-destructive">Payment activity could not be loaded.</p>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 dark:bg-muted/50">
              <span className="text-sm text-muted-foreground">Transactions in selected period</span>
              <span className="text-lg font-semibold tabular-nums">{payments.data?.meta?.total ?? 0}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
