
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getApiError } from "@/lib/auth";
import { useComplaints, useCreateAssignment } from "@/hooks/useComplaints";
import { useDepartmentTechnicians } from "@/hooks/useUsers";

const assignableStatuses = new Set([
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "REOPENED",
]);

export function AssignmentForm({
  returnTo,
}: {
  returnTo: string;
}) {
  const router = useRouter();

  const complaints = useComplaints({
    page: 1,
    limit: 100,
  });

  const technicians = useDepartmentTechnicians({ page: 1, limit: 100 });

  const createAssignment = useCreateAssignment();

  const [complaintId, setComplaintId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [notes, setNotes] = useState("");

  const assignableComplaints = (
    complaints.data?.data ?? []
  ).filter((complaint) =>
    assignableStatuses.has(complaint.status)
  );

  const selectedComplaint = assignableComplaints.find(
    (complaint) => complaint.id === complaintId
  );

  const selectedDepartmentId =
    selectedComplaint?.departmentId ||
    selectedComplaint?.department?.id;

  const eligibleTechnicians = (
    technicians.data?.data ?? []
  ).filter(
    (technician) =>
      Boolean(selectedDepartmentId) &&
      (technician.departmentId ||
        technician.department?.id) === selectedDepartmentId
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!complaintId || !technicianId) return;

    createAssignment.mutate(
      {
        complaintId,
        technicianId,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => router.push(returnTo),
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Technician Assignment</CardTitle>
        <CardDescription>
          Select a complaint and assign it to an active technician
          from the same department.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {complaints.isLoading ? (
          <Skeleton className="mb-4 h-10 w-full" />
        ) : complaints.isError ? (
          <p className="mb-4 text-sm text-destructive">
            Could not load department complaints:{" "}
            {getApiError(complaints.error)}
          </p>
        ) : null}

        {technicians.isError && (
          <p className="mb-4 text-sm text-destructive">
            Could not load technicians: {getApiError(technicians.error)}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Complaint
            </label>

            <select
              required
              value={complaintId}
              onChange={(event) => {
                setComplaintId(event.target.value);
                setTechnicianId("");
              }}
              disabled={complaints.isLoading || complaints.isError}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose a complaint</option>

              {assignableComplaints.map((complaint) => (
                <option key={complaint.id} value={complaint.id}>
                  {complaint.trackingCode} - {complaint.title}
                </option>
              ))}
            </select>

            {!complaints.isLoading &&
              !complaints.isError &&
              !assignableComplaints.length && (
                <p className="text-xs text-muted-foreground">
                  No assignable complaints found.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Technician
            </label>

            <select
              required
              value={technicianId}
              onChange={(event) =>
                setTechnicianId(event.target.value)
              }
              disabled={
                !selectedComplaint ||
                technicians.isLoading ||
                technicians.isError
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose a technician</option>

              {eligibleTechnicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} - {technician.email}
                </option>
              ))}
            </select>

            {selectedComplaint &&
              selectedDepartmentId &&
              !technicians.isLoading &&
              !technicians.isError &&
              !eligibleTechnicians.length && (
                <p className="text-xs text-muted-foreground">
                  No active technicians found in this department.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assignment Notes
            </label>

            <Textarea
              placeholder="Write assignment instructions..."
              maxLength={1000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onPress={() => router.push(returnTo)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isDisabled={
                createAssignment.isPending ||
                complaints.isLoading ||
                technicians.isLoading ||
                !complaintId ||
                !technicianId
              }
            >
              {createAssignment.isPending
                ? "Creating..."
                : "Create Assignment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
