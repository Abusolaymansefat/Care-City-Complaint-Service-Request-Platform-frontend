"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { PaymentsList } from "@/components/payments/payments-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments } from "@/hooks/useComplaints";
import { useAdminPayments, useMyPayments } from "@/hooks/usePayments";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const user = useAuthStore((state) => state.user);
  const mounted = useMounted();
  const isCitizen = mounted && user?.role === "CITIZEN";
  const isTechnician = mounted && user?.role === "TECHNICIAN";
  const isDepartmentOfficer = mounted && user?.role === "DEPARTMENT_OFFICER";
  const isAdmin = mounted && user?.role === "ADMIN";
  const myPayments = useMyPayments({ page, limit: 10 }, Boolean(isCitizen));
  const adminPayments = useAdminPayments({ page, limit: 10 }, Boolean(isAdmin));
  const assignments = useAssignments(
    { page: 1, limit: 100 },
    Boolean(isTechnician || isDepartmentOfficer),
  );

  if (!mounted) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((item) => <Skeleton key={item} className="h-20 w-full" />)}
      </div>
    );
  }

  if (isCitizen || isAdmin) {
    const query = isAdmin ? adminPayments : myPayments;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {isAdmin ? "Payment history" : "My payment history"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Review all citizen payment transactions."
              : "Review your past and current transactions."}
          </p>
        </div>
        {query.isError ? (
          <Card role="alert">
            <CardHeader>
              <CardTitle>Could not load payment history</CardTitle>
              <CardDescription>Please refresh the page and try again.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <PaymentsList
            payments={query.data?.data}
            meta={query.data?.meta}
            isLoading={query.isLoading}
            page={page}
            onPageChange={setPage}
            emptyMessage="Payment transactions will appear here."
            showPayer={Boolean(isAdmin)}
          />
        )}
      </div>
    );
  }

  if (isTechnician || isDepartmentOfficer) {
    const history = assignments.data?.data ?? [];
    const detailBase = isTechnician ? "/technician/assignments" : "/officer/assignments";

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {isTechnician ? "My work history" : "Department work history"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isTechnician
              ? "Review assignments connected to your technician account."
              : "Review assignments for complaints handled by your department."}
          </p>
        </div>
        {assignments.isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => <Skeleton key={item} className="h-20 w-full" />)}
          </div>
        ) : assignments.isError ? (
          <Card role="alert">
            <CardHeader>
              <CardTitle>Could not load work history</CardTitle>
              <CardDescription>Please refresh the page and try again.</CardDescription>
            </CardHeader>
          </Card>
        ) : !history.length ? (
          <Card>
            <CardHeader>
              <CardTitle>No work history yet</CardTitle>
              <CardDescription>Assignments will appear here as work is created.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-3">
            {(assignments.data?.meta?.total ?? 0) > history.length && (
              <p className="text-sm text-muted-foreground">
                Showing the latest {history.length} of {assignments.data?.meta?.total} assignments.
              </p>
            )}
            {history.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">
                      <Link
                        href={`${detailBase}/${assignment.id}`}
                        className="hover:underline"
                      >
                        {assignment.complaint.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {assignment.complaint.trackingCode} · Assigned{" "}
                      {format(new Date(assignment.assignedAt), "dd MMM yyyy")}
                      {assignment.technician?.name
                        ? ` · ${assignment.technician.name}`
                        : ""}
                    </CardDescription>
                  </div>
                  <Badge variant={assignment.status === "COMPLETED" ? "default" : "secondary"}>
                    {assignment.status.replaceAll("_", " ")}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History is unavailable</CardTitle>
        <CardDescription>There is no history view configured for this account role.</CardDescription>
      </CardHeader>
    </Card>
  );
}
