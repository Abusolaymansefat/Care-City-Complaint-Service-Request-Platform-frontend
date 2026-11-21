
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { format, isPast, isValid } from "date-fns";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  Wrench,
} from "lucide-react";

import { useAssignments } from "@/hooks/useComplaints";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardTrendChart } from "@/components/dashboard/dashboard-trend-chart";
import { RecentNotificationsCard } from "@/components/dashboard/recent-notifications-card";
import { buildDailyCounts } from "@/components/dashboard/dashboard-data";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ACTIVE_STATUSES = ["ASSIGNED", "IN_PROGRESS"];

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-400",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
};

const statusColors: Record<string, string> = {
  ASSIGNED: "bg-blue-500",
  IN_PROGRESS: "bg-amber-500",
  COMPLETED: "bg-green-500",
  REJECTED: "bg-red-500",
  CANCELLED: "bg-slate-400",
};

function formatDate(value?: string | Date | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  return isValid(date)
    ? format(date, "dd MMM yyyy")
    : "Not available";
}

export default function TechnicianDashboard() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  const assignments = useAssignments(
    { page: 1, limit: 100 },
    Boolean(mounted && user?.role === "TECHNICIAN"),
  );

  const rows = useMemo(
    () => assignments.data?.data ?? [],
    [assignments.data],
  );
  const totalAssignments = assignments.data?.meta?.total ?? rows.length;

  const completedAssignments = rows.filter(
    (item) => item.status === "COMPLETED",
  );

  const activeAssignments = rows.filter((item) =>
    ACTIVE_STATUSES.includes(item.status),
  );

  const overdueAssignments = activeAssignments.filter((item) => {
    const dueDate = item.complaint.slaDueAt;

    return dueDate ? isPast(new Date(dueDate)) : false;
  });

  const completionRate = totalAssignments
    ? Math.round((completedAssignments.length / totalAssignments) * 100)
    : 0;

  const priorityCounts = useMemo(() => {
    const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

    return priorities.map((priority) => ({
      label: priority,
      value: activeAssignments.filter(
        (item) => item.complaint.priority === priority,
      ).length,
    }));
  }, [activeAssignments]);

  const statusCounts = useMemo(() => {
    const statuses = [
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "REJECTED",
      "CANCELLED",
    ];

    return statuses.map((status) => ({
      label: status.replaceAll("_", " "),
      value: rows.filter((item) => item.status === status).length,
      color: statusColors[status],
    }));
  }, [rows]);

  const upcomingAssignments = useMemo(() => {
    return [...activeAssignments]
      .filter((item) => item.complaint.slaDueAt)
      .sort(
        (a, b) =>
          new Date(a.complaint.slaDueAt!).getTime() -
          new Date(b.complaint.slaDueAt!).getTime(),
      )
      .slice(0, 5);
  }, [activeAssignments]);

  const dailyCounts = buildDailyCounts(
    completedAssignments,
    (item) => item.completedAt ?? item.assignedAt,
  );

  const stats = [
    {
      label: "Completed Tasks",
      value: completedAssignments.length,
      hint: "Latest 100 assignments",
      icon: CheckCircle2,
      tone: "green" as const,
      isLoading: assignments.isLoading,
      isError: assignments.isError,
    },
    {
      label: "Incomplete Tasks",
      value: activeAssignments.length,
      hint: "Assigned and in progress",
      icon: Clock3,
      tone: "amber" as const,
      isLoading: assignments.isLoading,
      isError: assignments.isError,
    },
    {
      label: "Overdue Tasks",
      value: overdueAssignments.length,
      hint: "Past SLA due date",
      icon: CalendarClock,
      tone: "cyan" as const,
      isLoading: assignments.isLoading,
      isError: assignments.isError,
    },
    {
      label: "Total Assignments",
      value: totalAssignments,
      hint: "All assigned tasks",
      icon: ClipboardList,
      tone: "blue" as const,
      isLoading: assignments.isLoading,
      isError: assignments.isError,
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (user?.role !== "TECHNICIAN") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard unavailable</CardTitle>
          <CardDescription>
            This dashboard is available for Technician accounts only.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Welcome Header */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#0849a0] via-[#1264d8] to-[#3196e8] p-5 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-sm font-medium text-blue-100">
            Technician Workspace
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>

          <p className="mt-2 text-sm text-blue-50/90">
            {user?.department?.name
              ? `${user.department.name} · `
              : ""}
            Manage your assignments and monitor service progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <LinkButton
            href="/technician/assignments"
            className="bg-white text-blue-800 hover:bg-blue-50"
          >
            <ClipboardList className="mr-2 size-4" />
            My Assignments
          </LinkButton>

          <LinkButton
            href="/technician/work-updates"
            variant="outline"
            className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Wrench className="mr-2 size-4" />
            Update Work
          </LinkButton>
        </div>
      </section>

      {/* Error */}
      {assignments.isError && (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Unable to load assignments</CardTitle>
            <CardDescription>
              Check your technician account and refresh the page.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardMetricCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Charts */}
      <section className="grid gap-4 xl:grid-cols-2">
        {/* Priority Breakdown */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80 dark:ring-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Tasks by Priority</CardTitle>
              <CardDescription>
                Priority distribution of your active assignments.
              </CardDescription>
            </div>
            <Badge variant="secondary">Priority</Badge>
          </CardHeader>

          <CardContent className="space-y-5">
            {priorityCounts.map((item) => {
              const max = Math.max(
                1,
                ...priorityCounts.map((priority) => priority.value),
              );

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        priorityColors[item.label]
                      }`}
                      style={{
                        width: `${(item.value / max) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <p className="text-xs text-muted-foreground">
              Based on your latest 100 assignments.
            </p>
          </CardContent>
        </Card>

        {/* Completion Status */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80 dark:ring-border">
          <CardHeader>
            <CardTitle>Task Completion Status</CardTitle>
            <CardDescription>
              Your assignment completion overview.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center gap-6 py-4 sm:flex-row">
              <div
                className="relative flex size-48 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#16a34a ${completionRate}%, #e2e8f0 ${completionRate}% 100%)`,
                }}
                role="img"
                aria-label={`${completionRate}% assignments completed`}
              >
                <div className="flex size-36 flex-col items-center justify-center rounded-full bg-background">
                  <span className="text-4xl font-bold">
                    {completionRate}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Completed
                  </span>
                </div>
              </div>

              <div className="w-full space-y-4">
                {statusCounts.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-3 rounded-full ${item.color}`}
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Tasks */}
      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80 dark:ring-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Due Tasks</CardTitle>
              <CardDescription>
                Active assignments ordered by SLA due date.
              </CardDescription>
            </div>
            <CalendarClock className="size-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            {assignments.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} className="h-16 w-full" />
                ))}
              </div>
            ) : upcomingAssignments.length ? (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const dueDate = new Date(
                    assignment.complaint.slaDueAt!,
                  );

                  const overdue = isPast(dueDate);

                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between gap-3 rounded-xl border p-3"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/technician/assignments/${assignment.id}`}
                          className="block truncate text-sm font-semibold hover:text-primary hover:underline"
                        >
                          {assignment.complaint.title}
                        </Link>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {assignment.complaint.trackingCode}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarClock className="size-3" />
                          Due {formatDate(assignment.complaint.slaDueAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge
                          variant={overdue ? "destructive" : "outline"}
                        >
                          {overdue ? "Overdue" : "Upcoming"}
                        </Badge>
                        <Badge variant="secondary">
                          {assignment.complaint.priority}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <CalendarClock className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="text-sm font-medium">No upcoming due tasks</p>
                <p className="text-xs text-muted-foreground">
                  Assignments with an SLA due date will appear here.
                </p>
              </div>
            )}

            <LinkButton
              href="/technician/map"
              variant="outline"
              className="mt-4 w-full"
            >
              <MapPin className="mr-2 size-4" />
              View Map & Locations
            </LinkButton>
          </CardContent>
        </Card>

        {/* Quick Overview */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/80 dark:ring-border">
          <CardHeader>
            <CardTitle>Work Overview</CardTitle>
            <CardDescription>
              Quick access to your daily work.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/technician/assignments"
              className="rounded-xl border p-4 transition hover:border-primary hover:bg-muted/50"
            >
              <ClipboardList className="mb-3 size-6 text-blue-600" />
              <p className="font-semibold">My Assignments</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {totalAssignments} total assignments
              </p>
            </Link>

            <Link
              href="/technician/work-updates"
              className="rounded-xl border p-4 transition hover:border-primary hover:bg-muted/50"
            >
              <Wrench className="mb-3 size-6 text-amber-600" />
              <p className="font-semibold">Work Updates</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeAssignments.length} active tasks
              </p>
            </Link>

            <Link
              href="/technician/completed"
              className="rounded-xl border p-4 transition hover:border-primary hover:bg-muted/50"
            >
              <CheckCircle2 className="mb-3 size-6 text-green-600" />
              <p className="font-semibold">Completed Tasks</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {completedAssignments.length} completed
              </p>
            </Link>

            <Link
              href="/technician/map"
              className="rounded-xl border p-4 transition hover:border-primary hover:bg-muted/50"
            >
              <MapPin className="mb-3 size-6 text-purple-600" />
              <p className="font-semibold">Map & Location</p>
              <p className="mt-1 text-sm text-muted-foreground">
                View complaint locations
              </p>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Completion Trend */}
      <DashboardTrendChart
        title="Task Completion Over Time"
        description="Completed assignments grouped by completion date."
        data={dailyCounts}
        isLoading={assignments.isLoading}
        isError={assignments.isError}
      />

      {/* Recent Assignments */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/80 dark:ring-border">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>
              Your latest assigned complaints.
            </CardDescription>
          </div>

          <Link
            href="/technician/assignments"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>

        <CardContent>
          {assignments.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-16 w-full" />
              ))}
            </div>
          ) : assignments.isError ? (
            <p className="text-sm text-destructive">
              Assignments could not be loaded.
            </p>
          ) : rows.length ? (
            <div className="divide-y">
              {rows.slice(0, 5).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/technician/assignments/${assignment.id}`}
                      className="block truncate text-sm font-semibold hover:text-primary hover:underline"
                    >
                      {assignment.complaint.title}
                    </Link>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {assignment.complaint.trackingCode} · Assigned{" "}
                      {formatDate(assignment.assignedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {assignment.complaint.priority}
                    </Badge>

                    <Badge
                      variant={
                        assignment.status === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {assignment.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="font-medium">No assignments yet</p>
              <p className="text-sm text-muted-foreground">
                New assignments will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <RecentNotificationsCard enabled={Boolean(mounted)} />
    </div>
  );
}
