"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList, Clock3, Wrench } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Badge } from "@/components/ui/badge";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
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
  const complaints = useComplaints({ page: 1, limit: 5 }, mounted && isDepartmentOfficer);
  const complaintTotal = useComplaints(
    { page: 1, limit: 1 },
    mounted && isDepartmentOfficer
  );
  const inProgressComplaints = useComplaints(
    { page: 1, limit: 1, status: "IN_PROGRESS" },
    mounted && isDepartmentOfficer
  );
  const resolvedComplaints = useComplaints(
    { page: 1, limit: 1, status: "RESOLVED" },
    mounted && isDepartmentOfficer
  );
  const closedComplaints = useComplaints(
    { page: 1, limit: 1, status: "CLOSED" },
    mounted && isDepartmentOfficer
  );
  const assignments = useAssignments({ page: 1, limit: 100 }, mounted && isTechnician);

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
  ];
  const isError = isTechnician ? assignments.isError : departmentQueries.some((query) => query.isError);
  const complaintRows = complaints.data?.data ?? [];
  const assignmentRows = assignments.data?.data ?? [];
  const openCount = isTechnician
    ? assignmentRows.filter((item) => item.status === "ASSIGNED" || item.status === "IN_PROGRESS").length
    : Math.max(
        0,
        (complaintTotal.data?.meta?.total ?? 0) -
          (resolvedComplaints.data?.meta?.total ?? 0) -
          (closedComplaints.data?.meta?.total ?? 0)
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
          label: "Cancelled or rejected",
          value: assignmentRows.filter((item) => item.status === "CANCELLED" || item.status === "REJECTED").length,
        },
      ]
    : [
        { label: "All department complaints", value: complaintTotal.data?.meta?.total ?? 0 },
        { label: "In progress", value: inProgressComplaints.data?.meta?.total ?? 0 },
        { label: "Resolved", value: resolvedComplaints.data?.meta?.total ?? 0 },
        { label: "Closed", value: closedComplaints.data?.meta?.total ?? 0 },
      ];
  const chartLoading = isTechnician
    ? assignments.isLoading
    : [complaintTotal, inProgressComplaints, resolvedComplaints, closedComplaints].some(
        (query) => query.isLoading,
      );
  const chartError = isTechnician
    ? assignments.isError
    : [complaintTotal, inProgressComplaints, resolvedComplaints, closedComplaints].some(
        (query) => query.isError,
      );

  const stats = [
    {
      title: isTechnician ? "My assignments" : "Department complaints",
      value: isTechnician ? assignments.data?.meta?.total : complaintTotal.data?.meta?.total,
      isLoading: isTechnician ? assignments.isLoading : complaintTotal.isLoading,
      isError: isTechnician ? assignments.isError : complaintTotal.isError,
      icon: ClipboardList,
    },
    {
      title: isTechnician ? "Open (latest 100)" : "Open",
      value: openCount,
      isLoading: isTechnician ? assignments.isLoading : complaintTotal.isLoading || resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: isTechnician ? assignments.isError : complaintTotal.isError || resolvedComplaints.isError || closedComplaints.isError,
      icon: Clock3,
    },
    {
      title: isTechnician ? "In progress (latest 100)" : "In progress",
      value: activeCount,
      isLoading: isTechnician ? assignments.isLoading : inProgressComplaints.isLoading,
      isError: isTechnician ? assignments.isError : inProgressComplaints.isError,
      icon: Wrench,
    },
    {
      title: isTechnician ? "Completed (latest 100)" : "Completed",
      value: completedCount,
      isLoading: isTechnician ? assignments.isLoading : resolvedComplaints.isLoading || closedComplaints.isLoading,
      isError: isTechnician ? assignments.isError : resolvedComplaints.isError || closedComplaints.isError,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {isTechnician ? "Technician dashboard" : "Department dashboard"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {user?.name}
          {user?.department?.name ? ` · ${user.department.name}` : ""}
          {isTechnician
            ? " — review your assigned city service work."
            : " — monitor complaints handled by your department."}
        </p>
      </div>

      {isError && (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load your work</CardTitle>
            <CardDescription>
              {isTechnician
                ? "Check that your account is assigned to a technician profile and try again."
                : "Check that your account belongs to an active department and try again."}
            </CardDescription>
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

      <DashboardBarChart
        title={isTechnician ? "Assignment status chart" : "Department complaint metrics"}
        description={
          isTechnician
            ? "Status counts for your latest 100 assignments."
            : "In-progress, resolved, and closed counts are included in the total."
        }
        items={chartItems}
        isLoading={chartLoading}
        isError={chartError}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>{isTechnician ? "Recent assignments" : "Recent department complaints"}</CardTitle>
            <CardDescription>
              {isTechnician
                ? "The latest complaints assigned to you."
                : "The latest complaints submitted to your department."}
            </CardDescription>
          </div>
          <Link href="/complaints" className="shrink-0 text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => <Skeleton key={item} className="h-16 w-full" />)}
            </div>
          ) : isError ? (
            <p className="text-sm text-muted-foreground">Your work list is temporarily unavailable.</p>
          ) : isTechnician ? (
            assignmentRows.length ? (
              <ul className="divide-y">
                {assignmentRows.slice(0, 5).map((assignment) => (
                  <li
                    key={assignment.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{assignment.complaint.title}</p>
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
              <p className="text-sm text-muted-foreground">No assignments have been assigned to you yet.</p>
            )
          ) : complaintRows.length ? (
            <ul className="divide-y">
              {complaintRows.slice(0, 5).map((complaint) => (
                <li
                  key={complaint.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{complaint.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {complaint.trackingCode} · {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                  <ComplaintStatusBadge status={complaint.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No complaints are currently assigned to your department.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
