"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, ClipboardList, FilePlus2, Search, Tags } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyComplaints } from "@/hooks/useComplaints";
import OperationsDashboard from "@/components/dashboard/operations-dashboard";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

const citizenStats = ["Total complaints", "Submitted", "In progress", "Resolved"];

const shortcuts = [
  { label: "Create a complaint", href: "/citizen/complaints/create-poster", icon: FilePlus2 },
  { label: "My complaints", href: "/citizen/complaints", icon: ClipboardList },
  { label: "Track a complaint", href: "/citizen/tracking", icon: Search },
  { label: "Browse categories", href: "/citizen/categories", icon: Tags },
];

export default function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const mounted = useMounted();
  const isCitizen = mounted && user?.role === "CITIZEN";
  const enabled = Boolean(isCitizen);
  const recentComplaints = useMyComplaints({ page: 1, limit: 5 }, enabled);
  const totalComplaints = useMyComplaints({ page: 1, limit: 1 }, enabled);
  const submittedComplaints = useMyComplaints(
    { page: 1, limit: 1, status: "SUBMITTED" },
    enabled
  );
  const inProgressComplaints = useMyComplaints(
    { page: 1, limit: 1, status: "IN_PROGRESS" },
    enabled
  );
  const resolvedComplaints = useMyComplaints(
    { page: 1, limit: 1, status: "RESOLVED" },
    enabled
  );
  const statQueries = [
    { label: "Total complaints", query: totalComplaints },
    { label: "Submitted", query: submittedComplaints },
    { label: "In progress", query: inProgressComplaints },
    { label: "Resolved", query: resolvedComplaints },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full max-w-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {citizenStats.map((label) => <Skeleton key={label} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{user ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isCitizen
            ? "Here is the latest activity on your city service requests."
            : "Your CityCare workspace is ready."}
        </p>
      </div>

      {isCitizen ? (
        <>
          {statQueries.some(({ query }) => query.isError) && (
            <Card role="alert">
              <CardHeader>
                <CardTitle>Could not load your overview</CardTitle>
                <CardDescription>
                  Complaint statistics are temporarily unavailable. Please refresh to try again.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statQueries.map(({ label, query }) => {
              return (
                <Card key={label}>
                  <CardHeader>
                    <CardDescription>{label}</CardDescription>
                    {query.isLoading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : user?.role === "TECHNICIAN" || user?.role === "DEPARTMENT_OFFICER" ? (
                      <OperationsDashboard />
                    ) : (
                      <CardTitle className="text-3xl">
                        {query.data?.meta?.total ?? query.data?.data.length ?? 0}
                      </CardTitle>
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shortcuts.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <CardContent className="flex items-center justify-between gap-3 pt-5">
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <Icon className="size-4 text-primary" aria-hidden="true" />
                      {label}
                    </span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Recent complaints</CardTitle>
                <CardDescription>Your latest submitted service requests.</CardDescription>
              </div>
              <Link
                href="/citizen/complaints"
                className="shrink-0 text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {recentComplaints.isLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((item) => <Skeleton key={item} className="h-14 w-full" />)}
                </div>
              ) : recentComplaints.isError ? (
                <p role="alert" className="text-sm text-destructive">
                  Could not load recent complaints. Please refresh and try again.
                </p>
              ) : !recentComplaints.data?.data.length ? (
                <p className="text-sm text-muted-foreground">You have not submitted a complaint yet.</p>
              ) : (
                <ul className="divide-y">
                  {recentComplaints.data.data.map((complaint) => (
                    <li
                      key={complaint.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/citizen/complaints/${complaint.id}`}
                          className="block truncate text-sm font-medium hover:underline"
                        >
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
            <CardHeader>
              <CardTitle>Payment information</CardTitle>
              <CardDescription>
                The first 2 complaints are free. From the 3rd complaint, a 10 BDT fee may apply.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/payments" className="text-sm text-primary hover:underline">
                View my payments
              </Link>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{user?.role.replaceAll("_", " ") ?? "Dashboard"}</CardTitle>
            <CardDescription>
              Use the navigation menu to access the tools available for your account.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
