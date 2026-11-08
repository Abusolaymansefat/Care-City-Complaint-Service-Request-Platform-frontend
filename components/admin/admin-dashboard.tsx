"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList, CreditCard, Users } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaints } from "@/hooks/useComplaints";
import { useAdminPayments } from "@/hooks/usePayments";
import { useAuthStore } from "@/store/auth.store";
import { useMounted } from "@/hooks/useMounted";

export default function AdminDashboard() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const complaints = useComplaints({ page: 1, limit: 5 }, mounted);
  const complaintTotal = useComplaints({ page: 1, limit: 1 }, mounted);
  const resolvedComplaints = useComplaints({ page: 1, limit: 1, status: "RESOLVED" }, mounted);
  const closedComplaints = useComplaints({ page: 1, limit: 1, status: "CLOSED" }, mounted);
  const payments = useAdminPayments({ page: 1, limit: 1 });
  const complaintRows = complaints.data?.data ?? [];
  const statsQueries = [complaints, complaintTotal, resolvedComplaints, closedComplaints, payments];
  const isError = statsQueries.some((query) => query.isError);

  const stats = [
    { title: "Total complaints", value: complaintTotal.data?.meta?.total, isLoading: complaintTotal.isLoading, isError: complaintTotal.isError, icon: ClipboardList },
    {
      title: "Open complaints",
      value: Math.max(
        0,
        (complaintTotal.data?.meta?.total ?? 0) -
          (resolvedComplaints.data?.meta?.total ?? 0) -
          (closedComplaints.data?.meta?.total ?? 0)
      ),
      isLoading: complaintTotal.isLoading || resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: complaintTotal.isError || resolvedComplaints.isError || closedComplaints.isError,
      icon: ClipboardList,
    },
    {
      title: "Resolved",
      value: (resolvedComplaints.data?.meta?.total ?? 0) + (closedComplaints.data?.meta?.total ?? 0),
      isLoading: resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: resolvedComplaints.isError || closedComplaints.isError,
      icon: ClipboardList,
    },
    { title: "Payments", value: payments.data?.meta?.total, isLoading: payments.isLoading, isError: payments.isError, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome{user ? `, ${user.name}` : ""}. Monitor city complaints and service activity.
        </p>
      </div>

      {isError && (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Some dashboard data could not be loaded</CardTitle>
            <CardDescription>Refresh the page to retry loading system statistics.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
