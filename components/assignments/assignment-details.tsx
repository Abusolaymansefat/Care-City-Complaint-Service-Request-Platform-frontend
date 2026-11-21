
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignment,
  useUpdateAssignmentStatus,
} from "@/hooks/useComplaints";
import type { AssignmentStatus } from "@/types";

const nextStatuses: Partial<
  Record<AssignmentStatus, AssignmentStatus[]>
> = {
  ASSIGNED: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["COMPLETED", "REJECTED"],
};

export function AssignmentDetails({
  id,
  role,
}: {
  id: string;
  role: "admin" | "officer" | "technician";
}) {
  const { data: assignment, isLoading, isError } = useAssignment(id);
  const updateStatus = useUpdateAssignmentStatus();
  const [notes, setNotes] = useState("");

  if (isLoading) {
    return <Skeleton className="h-72 w-full max-w-2xl rounded-xl" />;
  }

  if (isError || !assignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignment not found</CardTitle>
          <CardDescription>
            This assignment is unavailable or you do not have permission.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Department Officer can view, but cannot update status
  // according to the current backend service permission.
  const statuses =
    role === "officer"
      ? []
      : nextStatuses[assignment.status] ?? [];

  const returnTo =
    role === "admin"
      ? "/admin/assignments"
      : role === "officer"
        ? "/officer/assignments"
        : "/technician/assignments";

  const handleStatusUpdate = (status: AssignmentStatus) => {
    updateStatus.mutate({
      id,
      status,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <CardHeader className="flex flex-col justify-between gap-3 sm:flex-row">
          <div>
            <CardTitle>{assignment.complaint.title}</CardTitle>
            <CardDescription>
              {assignment.complaint.trackingCode}
            </CardDescription>
            <p className="mt-2 text-xs text-muted-foreground">
              Assigned{" "}
              {format(
                new Date(assignment.assignedAt),
                "dd MMM yyyy, hh:mm a"
              )}
            </p>
          </div>

          <Badge variant="secondary">
            {assignment.status.replaceAll("_", " ")}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Complaint status</p>
              <p className="font-medium">
                {assignment.complaint.status.replaceAll("_", " ")}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Technician</p>
              <p className="font-medium">
                {assignment.technician?.name ?? "Unavailable"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Assigned by</p>
              <p className="font-medium">
                {assignment.assignedBy?.name ?? "Unavailable"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Technician email</p>
              <p className="font-medium">
                {assignment.technician?.email ?? "Unavailable"}
              </p>
            </div>
          </div>

          {assignment.notes && (
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">Assignment notes</p>
              <p className="mt-1 text-muted-foreground">
                {assignment.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {statuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Update assignment</CardTitle>
            <CardDescription>
              Update the technician assignment progress.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write update notes..."
              maxLength={1000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  isDisabled={updateStatus.isPending}
                  variant={
                    status === "REJECTED" ? "destructive" : "default"
                  }
                  onPress={() => handleStatusUpdate(status)}
                >
                  {status === "IN_PROGRESS"
                    ? "Start Work"
                    : status === "COMPLETED"
                      ? "Mark Completed"
                      : "Reject Assignment"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <LinkButton href={returnTo} variant="outline">
        Back to Assignments
      </LinkButton>
    </div>
  );
}
