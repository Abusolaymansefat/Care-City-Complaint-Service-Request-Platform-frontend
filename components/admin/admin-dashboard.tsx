"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { ClipboardList, CreditCard, Users } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaints } from "@/hooks/useComplaints";
import { useAdminPaymentStats, useAdminPayments } from "@/hooks/usePayments";
import { useAuthStore } from "@/store/auth.store";
import { useMounted } from "@/hooks/useMounted";
import type { PaymentPeriod } from "@/types";

export default function AdminDashboard() {
  const [period, setPeriod] = useState<PaymentPeriod>("7d");
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const complaints = useComplaints({ page: 1, limit: 5 }, mounted);
  const complaintTotal = useComplaints({ page: 1, limit: 1 }, mounted);
  const resolvedComplaints = useComplaints({ page: 1, limit: 1, status: "RESOLVED" }, mounted);
  const closedComplaints = useComplaints({ page: 1, limit: 1, status: "CLOSED" }, mounted);
  const payments = useAdminPayments({ page: 1, limit: 1, period });
  const paymentStats = useAdminPaymentStats(period);
  const complaintRows = complaints.data?.data ?? [];
  const totalComplaintCount = complaintTotal.data?.meta?.total ?? 0;
  const resolvedComplaintCount = resolvedComplaints.data?.meta?.total ?? 0;
  const closedComplaintCount = closedComplaints.data?.meta?.total ?? 0;
  const notResolvedOrClosedCount = Math.max(
    0,
    totalComplaintCount - resolvedComplaintCount - closedComplaintCount,
  );
  const statsQueries = [complaints, complaintTotal, resolvedComplaints, closedComplaints, payments, paymentStats];
  const isError = statsQueries.some((query) => query.isError);

  const stats = [
    { title: "Total complaints", value: complaintTotal.data?.meta?.total, isLoading: complaintTotal.isLoading, isError: complaintTotal.isError, icon: ClipboardList },
    {
      title: "Open complaints",
      value: notResolvedOrClosedCount,
      isLoading: complaintTotal.isLoading || resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: complaintTotal.isError || resolvedComplaints.isError || closedComplaints.isError,
      icon: ClipboardList,
    },
    {
      title: "Resolved",
      value: resolvedComplaintCount + closedComplaintCount,
      isLoading: resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: resolvedComplaints.isError || closedComplaints.isError,
      icon: ClipboardList,
    },
    { title: "Payments in period", value: payments.data?.meta?.total, isLoading: payments.isLoading, isError: payments.isError, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome{user ? `, ${user.name}` : ""}. Monitor city complaints and service activity.
          </p>
        </div>
        <select
          aria-label="Payment dashboard time period"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={period}
          onChange={(event) => setPeriod(event.target.value as PaymentPeriod)}
        >
          <option value="7d">Last 7 days</option>
          <option value="1m">Last month</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {isError && (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Some dashboard data could not be loaded</CardTitle>
            <CardDescription>Refresh the page to retry loading system statistics.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardDescription>{stat.title}</CardDescription>
                {stat.isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <CardTitle className="text-3xl">{stat.isError ? "—" : stat.value ?? 0}</CardTitle>
                )}
              </div>
              <stat.icon className="size-5 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <DashboardBarChart
        title="Complaint status overview"
        description="Complaints outside resolved or closed statuses are grouped as open."
        items={[
          { label: "Open / other statuses", value: notResolvedOrClosedCount },
          { label: "Resolved", value: resolvedComplaintCount },
          { label: "Closed", value: closedComplaintCount },
        ]}
        isLoading={
          complaintTotal.isLoading || resolvedComplaints.isLoading || closedComplaints.isLoading
        }
        isError={
          complaintTotal.isError || resolvedComplaints.isError || closedComplaints.isError
        }
      />

      <Card>
        <CardHeader>
          <CardDescription>
            Amount collected · {period === "all" ? "All time" : period === "7d" ? "Last 7 days" : period === "1m" ? "Last month" : "Last year"}
          </CardDescription>
          {paymentStats.isLoading ? (
            <Skeleton className="h-9 w-36" />
          ) : (
            <CardTitle className="text-3xl">
              {paymentStats.isError
                ? "—"
                : `BDT ${Number(paymentStats.data?.totalAmount ?? 0).toFixed(2)}`}
            </CardTitle>
          )}
          {!paymentStats.isLoading && !paymentStats.isError && (
            <CardDescription>
              {paymentStats.data?.paidCount ?? 0} successful payments
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/complaints" className="group">
          <Card className="transition-colors group-hover:border-primary/50">
            <CardContent className="flex items-center gap-3 pt-5">
              <ClipboardList className="size-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Review all complaints</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users" className="group">
          <Card className="transition-colors group-hover:border-primary/50">
            <CardContent className="flex items-center gap-3 pt-5">
              <Users className="size-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">User management</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Latest complaints</CardTitle>
            <CardDescription>Recently submitted city service requests.</CardDescription>
          </div>
          <Link href="/admin/complaints" className="shrink-0 text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {complaints.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
            </div>
          ) : complaints.isError ? (
            <p className="text-sm text-muted-foreground">Complaint activity is temporarily unavailable.</p>
          ) : !complaintRows.length ? (
            <p className="text-sm text-muted-foreground">No complaints have been submitted yet.</p>
          ) : (
            <ul className="divide-y">
              {complaintRows.slice(0, 5).map((complaint) => (
                <li
                  key={complaint.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
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
    </div>
  );
}
