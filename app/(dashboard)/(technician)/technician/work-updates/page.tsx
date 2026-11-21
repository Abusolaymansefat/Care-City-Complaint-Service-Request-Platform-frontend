
"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ClipboardCheck, Send } from "lucide-react";

import {
  useAssignments,
  useUpdateAssignmentStatus,
} from "@/hooks/useComplaints";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import type { AssignmentStatus } from "@/types";

const nextStatuses: Partial<
  Record<AssignmentStatus, AssignmentStatus[]>
> = {
  ASSIGNED: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["COMPLETED", "REJECTED"],
};

export default function TechnicianWorkUpdatesPage() {
  const { data, isLoading, isError } = useAssignments({
    page: 1,
    limit: 100,
  });

  const updateMutation = useUpdateAssignmentStatus();

  const [assignmentId, setAssignmentId] = useState("");
  const [status, setStatus] = useState<AssignmentStatus | "">("");
  const [notes, setNotes] = useState("");

  const activeAssignments = useMemo(
    () =>
      (data?.data ?? []).filter(
        (item) =>
          item.status === "ASSIGNED" ||
          item.status === "IN_PROGRESS"
      ),
    [data]
  );

  const selectedAssignment = activeAssignments.find(
    (item) => item.id === assignmentId
  );

  const allowedStatuses = selectedAssignment
    ? nextStatuses[selectedAssignment.status] ?? []
    : [];

  const handleAssignmentChange = (id: string) => {
    setAssignmentId(id);
    setStatus("");
    setNotes("");
  };

  const handleSubmit = () => {
    if (!assignmentId || !status || !notes.trim()) return;

    updateMutation.mutate(
      {
        id: assignmentId,
        status,
        notes: notes.trim(),
      },
      {
        onSuccess: () => {
          setAssignmentId("");
          setStatus("");
          setNotes("");
        },
      }
    );
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading assignments...</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Could not load assignments.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Work Updates</h1>
        <p className="text-sm text-muted-foreground">
          Submit progress notes and update your assignment status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="size-5" />
            Submit Work Progress
          </CardTitle>
          <CardDescription>
            Select an active assignment and submit your latest work update.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Assignment
            </label>

            <select
              value={assignmentId}
              onChange={(e) => handleAssignmentChange(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Choose an assignment</option>

              {activeAssignments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.complaint.trackingCode} - {item.complaint.title}
                </option>
              ))}
            </select>
          </div>

          {activeAssignments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You do not have any active assignments.
            </p>
          )}

          {selectedAssignment && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <p className="font-semibold">
                  {selectedAssignment.complaint.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedAssignment.complaint.trackingCode}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {selectedAssignment.status.replaceAll("_", " ")}
                </Badge>

                <Badge variant="outline">
                  {selectedAssignment.complaint.priority}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Assigned on{" "}
                {format(
                  new Date(selectedAssignment.assignedAt),
                  "dd MMM yyyy"
                )}
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Update Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as AssignmentStatus)
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Select new status</option>

                  {allowedStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Progress / Resolution Notes
                </label>

                <Textarea
                  rows={5}
                  maxLength={1000}
                  placeholder="Describe the work progress or resolution..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <p className="text-right text-xs text-muted-foreground">
                  {notes.length}/1000
                </p>
              </div>

              <Button
                className="w-full"
                isDisabled={
                  !status ||
                  !notes.trim() ||
                  updateMutation.isPending
                }
                onPress={handleSubmit}
              >
                <Send className="mr-2 size-4" />
                {updateMutation.isPending
                  ? "Submitting..."
                  : "Submit Work Update"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
