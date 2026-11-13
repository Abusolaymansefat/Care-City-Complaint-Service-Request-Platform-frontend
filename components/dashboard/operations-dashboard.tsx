"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  CircleCheck,
  ClipboardList,
  Clock3,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments, useComplaints } from "@/hooks/useComplaints";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

export default function OperationsDashboard() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const isTechnician = user?.role === "TECHNICIAN";
  const isDepartmentOfficer = user?.role === "DEPARTMENT_OFFICER";
  const isOperationsRole = isTechnician || isDepartmentOfficer;
  const complaints = useComplaints(
    { page: 1, limit: DASHBOARD_RECORD_LIMIT },
    mounted && isDepartmentOfficer,
  );
  const complaintTotal = useComplaints(
    { page: 1, limit: 1 },
    mounted && isDepartmentOfficer,
  );
  const inProgressComplaints = useComplaints(
    { page: 1, limit: 1, status: "IN_PROGRESS" },
    mounted && isDepartmentOfficer,
  );
  const resolvedComplaints = useComplaints(
    { page: 1, limit: 1, status: "RESOLVED" },
    mounted && isDepartmentOfficer,
  );
  const closedComplaints = useComplaints(
    { page: 1, limit: 1, status: "CLOSED" },
    mounted && isDepartmentOfficer,
  );
  const rejectedComplaints = useComplaints(
    { page: 1, limit: 1, status: "REJECTED" },
    mounted && isDepartmentOfficer,
  );
  const cancelledComplaints = useComplaints(
    { page: 1, limit: 1, status: "CANCELLED" },
    mounted && isDepartmentOfficer,
  );
  const assignments = useAssignments({ page: 1, limit: 100 }, mounted && isTechnician);

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

  if (!isOperationsRole) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard unavailable</CardTitle>
          <CardDescription>This dashboard is not configured for your account role.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isLoading = isTechnician ? assignments.isLoading : complaints.isLoading;
  const departmentQueries = [
    complaints,
    complaintTotal,
    inProgressComplaints,
    resolvedComplaints,
    closedComplaints,
    rejectedComplaints,
    cancelledComplaints,
  ];
  const isError = isTechnician
    ? assignments.isError
    : departmentQueries.some((query) => query.isError);
  const complaintRows = complaints.data?.data ?? [];
  const assignmentRows = assignments.data?.data ?? [];
  const openCount = isTechnician
    ? assignmentRows.filter((item) => item.status === "ASSIGNED" || item.status === "IN_PROGRESS").length
    : Math.max(
        0,
        (complaintTotal.data?.meta?.total ?? 0) -
          (resolvedComplaints.data?.meta?.total ?? 0) -
        (closedComplaints.data?.meta?.total ?? 0) -
        (rejectedComplaints.data?.meta?.total ?? 0) -
        (cancelledComplaints.data?.meta?.total ?? 0),
      );
  const activeCount = isTechnician
    ? assignmentRows.filter((item) => item.status === "IN_PROGRESS").length
    : inProgressComplaints.data?.meta?.total ?? 0;
  const completedCount = isTechnician
    ? assignmentRows.filter((item) => item.status === "COMPLETED").length
    : (resolvedComplaints.data?.meta?.total ?? 0) + (closedComplaints.data?.meta?.total ?? 0);
  const chartItems = isTechnician
    ? [
        { label: "Assigned", value: assignmentRows.filter((item) => item.status === "ASSIGNED").length },
        { label: "In progress", value: assignmentRows.filter((item) => item.status === "IN_PROGRESS").length },
        { label: "Completed", value: assignmentRows.filter((item) => item.status === "COMPLETED").length },
        {
          label: "Rejected or cancelled",
          value: assignmentRows.filter((item) => item.status === "CANCELLED" || item.status === "REJECTED").length,
        },
      ]
    : [
        { label: "Open / awaiting work", value: Math.max(0, openCount - activeCount) },
        { label: "In progress", value: activeCount },
        { label: "Resolved", value: resolvedComplaints.data?.meta?.total ?? 0 },
        { label: "Closed", value: closedComplaints.data?.meta?.total ?? 0 },
      ];
  const dailyCounts = isTechnician
    ? buildDailyCounts(assignmentRows, (assignment) => assignment.assignedAt)
    : buildDailyCounts(complaintRows, (complaint) => complaint.createdAt);
  const categoryCounts = buildTopCounts(complaintRows, (complaint) => complaint.category?.name);
  const chartLoading = isTechnician
    ? assignments.isLoading
    : [
        complaintTotal,
        inProgressComplaints,
        resolvedComplaints,
        closedComplaints,
        rejectedComplaints,
        cancelledComplaints,
      ].some(
        (query) => query.isLoading,
      );
  const chartError = isTechnician
    ? assignments.isError
    : [
        complaintTotal,
        inProgressComplaints,
        resolvedComplaints,
        closedComplaints,
        rejectedComplaints,
        cancelledComplaints,
      ].some((query) => query.isError);
  const stats = [
    {
      label: isTechnician ? "My assignments" : "Department complaints",
      value: isTechnician ? assignments.data?.meta?.total : complaintTotal.data?.meta?.total,
      hint: isTechnician ? "All assignments" : "All department requests",
      icon: ClipboardList,
      tone: "blue" as const,
      isLoading: isTechnician ? assignments.isLoading : complaintTotal.isLoading,
      isError: isTechnician ? assignments.isError : complaintTotal.isError,
    },
    {
      label: isTechnician ? "Open assignments" : "Open complaints",
      value: openCount,
      hint: isTechnician ? "Latest 100 assignments" : "Awaiting completion",
      icon: Clock3,
      tone: "amber" as const,
      isLoading: isTechnician
        ? assignments.isLoading
        : complaintTotal.isLoading ||
          resolvedComplaints.isLoading ||
          closedComplaints.isLoading ||
          rejectedComplaints.isLoading ||
          cancelledComplaints.isLoading,
      isError: isTechnician
        ? assignments.isError
        : complaintTotal.isError ||
          resolvedComplaints.isError ||
          closedComplaints.isError ||
          rejectedComplaints.isError ||
          cancelledComplaints.isError,
    },
    {
      label: "In progress",
      value: activeCount,
      hint: isTechnician ? "Latest 100 assignments" : "Currently being handled",
      icon: Wrench,
      tone: "cyan" as const,
      isLoading: isTechnician ? assignments.isLoading : inProgressComplaints.isLoading,
      isError: isTechnician ? assignments.isError : inProgressComplaints.isError,
    },
    {
      label: isTechnician ? "Completed" : "Resolved or closed",
      value: completedCount,
      hint: isTechnician ? "Latest 100 assignments" : "Completed requests",
      icon: CircleCheck,
      tone: "green" as const,
      isLoading: isTechnician
        ? assignments.isLoading
        : resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: isTechnician
        ? assignments.isError
        : resolvedComplaints.isError || closedComplaints.isError,
    },
  ];
  const workTitle = isTechnician ? "Recent assignments" : "Recent department complaints";
  const allWorkHref = isTechnician ? "/technician/assignments" : "/officer/complaints";

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-linear-to-r from-[#0849a0] via-[#1264d8] to-[#3196e8] p-5 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-sm font-medium text-blue-100">
            {isTechnician ? "Technician workspace" : "Department operations"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome{user ? `, ${user.name}` : ""}
          </h2>
          <p className="mt-2 text-sm text-blue-50/90">
            {user?.department?.name ? `${user.department.name} · ` : ""}
            {isTechnician
              ? "Your assignments and service progress at a glance."
              : "Monitor service requests and department activity."}
          </p>
        </div>
        <Link
          href={allWorkHref}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#0849a0] shadow-sm transition hover:bg-blue-50"
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          {isTechnician ? "My assignments" : "Department complaints"}
        </Link>
      </section>

      {isError && (
        <Card role="alert" className="border-0 shadow-sm ring-1 ring-red-200">
          <CardHeader>
            <CardTitle>Some work data could not be loaded</CardTitle>
            <CardDescription>
              {isTechnician
                ? "Check that your account is assigned to a technician profile, then refresh."
                : "Check that your account belongs to an active department, then refresh."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <DashboardMetricCard key={stat.label} {...stat} />)}
      </div>

      <section aria-label="Work trends and status" className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <DashboardTrendChart
          title={isTechnician ? "Assignment activity" : "Department complaint activity"}
          description={
            isTechnician
              ? "Assignments created per day from your latest 100 records."
              : `Complaints submitted per day from your department’s latest ${DASHBOARD_RECORD_LIMIT} records.`
          }
          data={dailyCounts}
          isLoading={isTechnician ? assignments.isLoading : complaints.isLoading}
          isError={isTechnician ? assignments.isError : complaints.isError}
        />
        <DashboardBarChart
          title={isTechnician ? "Assignment status" : "Complaint status"}
          description={
            isTechnician
              ? "Status distribution for your latest 100 assignments."
              : "Current status totals for your department."
          }
          items={chartItems}
          isLoading={chartLoading}
          isError={chartError}
        />
      </section>

      {isDepartmentOfficer && (
        <DashboardBarChart
          title="Requests by service category"
          description={`Category distribution in your department’s latest ${DASHBOARD_RECORD_LIMIT} complaints.`}
          items={categoryCounts}
          isLoading={complaints.isLoading}
          isError={complaints.isError}
        />
      )}

      <section aria-label="Recent work and notifications" className="grid gap-4 xl:grid-cols-2">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>{workTitle}</CardTitle>
              <CardDescription>
                {isTechnician
                  ? "The latest complaints assigned to you."
                  : "The latest requests submitted to your department."}
              </CardDescription>
            </div>
            <Link href={allWorkHref} className="shrink-0 text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => <Skeleton key={item} className="h-16 w-full" />)}
              </div>
            ) : isError ? (
              <p role="alert" className="text-sm text-destructive">Your work list is unavailable.</p>
            ) : isTechnician ? (
              assignmentRows.length ? (
                <ul className="divide-y divide-slate-100 dark:divide-border">
                  {assignmentRows.slice(0, 5).map((assignment) => (
                    <li key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <Link href={`/technician/assignments/${assignment.id}`} className="block truncate text-sm font-medium hover:text-blue-700 hover:underline">
                          {assignment.complaint.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {assignment.complaint.trackingCode} · {format(new Date(assignment.assignedAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      <Badge variant={assignment.status === "COMPLETED" ? "default" : "secondary"}>
                        {assignment.status.replaceAll("_", " ")}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">No assignments have been assigned to you yet.</p>
              )
            ) : complaintRows.length ? (
              <ul className="divide-y divide-slate-100 dark:divide-border">
                {complaintRows.slice(0, 5).map((complaint) => (
                  <li key={complaint.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <Link href={`/officer/complaints/${complaint.id}`} className="block truncate text-sm font-medium hover:text-blue-700 hover:underline">
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
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No complaints are currently assigned to your department.</p>
            )}
          </CardContent>
        </Card>

        <RecentNotificationsCard enabled={Boolean(mounted && isOperationsRole)} />
      </section>
    </div>
  );
}
