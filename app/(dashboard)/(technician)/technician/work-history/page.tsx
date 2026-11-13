"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useAssignments } from "@/hooks/useComplaints";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianWorkHistoryPage() {
  const { data, isLoading, isError } = useAssignments({ page: 1, limit: 100 });
  const completed = (data?.data ?? []).filter((assignment) => assignment.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Work history</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completed assignments from your recent work.
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => <Skeleton key={item} className="h-20 w-full" />)}
        </div>
      ) : isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load work history</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !completed.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No completed assignments yet</CardTitle>
            <CardDescription>Completed work will appear here.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {(data?.meta?.total ?? 0) > 100 && (
            <p className="text-sm text-muted-foreground">
              Showing completed work from the latest 100 assignments.
            </p>
          )}
          {completed.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    <Link href={`/technician/assignments/${assignment.id}`} className="hover:underline">
                      {assignment.complaint.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {assignment.complaint.trackingCode} · Completed{" "}
                    {assignment.completedAt
                      ? format(new Date(assignment.completedAt), "dd MMM yyyy")
                      : format(new Date(assignment.assignedAt), "dd MMM yyyy")}
                  </CardDescription>
                </div>
                <Badge>Completed</Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
