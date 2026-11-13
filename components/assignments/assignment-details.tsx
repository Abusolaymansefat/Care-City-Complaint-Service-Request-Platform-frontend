"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAssignment, useUpdateAssignmentStatus } from "@/hooks/useComplaints";
import type { AssignmentStatus } from "@/types";
import { useState } from "react";

const nextStatuses: Partial<Record<AssignmentStatus, AssignmentStatus[]>> = {
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

  if (isLoading) return <Skeleton className="h-72 w-full max-w-2xl rounded-xl" />;

  if (isError || !assignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignment not found</CardTitle>
          <CardDescription>
            This assignment is unavailable or your account cannot access it.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const statuses = role === "officer" ? [] : nextStatuses[assignment.status] ?? [];
  const returnTo = role === "admin" ? "/admin/assignments" : "/officer/assignments";

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{assignment.complaint.title}</CardTitle>
            <CardDescription>
              {assignment.complaint.trackingCode} · Assigned {format(new Date(assignment.assignedAt), "dd MMM yyyy, hh:mm a")}
            </CardDescription>
          </div>
          <Badge variant={assignment.status === "COMPLETED" ? "default" : "secondary"}>
            {assignment.status.replaceAll("_", " ")}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Complaint status: {assignment.complaint.status.replaceAll("_", " ")}</p>
          <p>Technician: {assignment.technician?.name ?? "Unavailable"}{assignment.technician?.email ? ` · ${assignment.technician.email}` : ""}</p>
          <p>Assigned by: {assignment.assignedBy?.name ?? "Unavailable"}</p>
          {assignment.notes && <p className="text-muted-foreground">Notes: {assignment.notes}</p>}
        </CardContent>
      </Card>

      {statuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Update assignment</CardTitle>
            <CardDescription>
              Status changes also update the related complaint and notify the citizen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              aria-label="Status update notes"
              maxLength={1000}
              placeholder="Optional update notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={status === "REJECTED" ? "destructive" : "default"}
                  isDisabled={updateStatus.isPending}
                  onPress={() =>
                    updateStatus.mutate({
                      id,
                      status,
                      notes: notes.trim() || undefined,
                    })
                  }
                >
                  {status === "IN_PROGRESS"
                    ? "Start work"
                    : status === "COMPLETED"
                      ? "Mark complete"
                      : "Reject assignment"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Link href={returnTo} className="text-sm font-medium text-primary hover:underline">
        Back to assignments
      </Link>
    </div>
  );
}
