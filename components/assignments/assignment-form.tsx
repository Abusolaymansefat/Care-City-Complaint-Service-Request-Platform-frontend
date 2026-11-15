"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useComplaints, useCreateAssignment } from "@/hooks/useComplaints";
import { useUsers } from "@/hooks/useUsers";

const assignableStatuses = new Set(["SUBMITTED", "UNDER_REVIEW", "REOPENED"]);

export function AssignmentForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const complaints = useComplaints({ page: 1, limit: 100 });
  const technicians = useUsers({
    page: 1,
    limit: 100,
    role: "TECHNICIAN",
    status: "ACTIVE",
  });
  const createAssignment = useCreateAssignment();
  const [complaintId, setComplaintId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [notes, setNotes] = useState("");
  const assignableComplaints = (complaints.data?.data ?? []).filter((complaint) =>
    assignableStatuses.has(complaint.status)
  );
  const selectedComplaint = assignableComplaints.find((complaint) => complaint.id === complaintId);
  const selectedDepartmentId =
    selectedComplaint?.departmentId || selectedComplaint?.department?.id;
  const eligibleTechnicians = (technicians.data?.data ?? []).filter(
    (technician) =>
      Boolean(selectedDepartmentId) &&
      (technician.departmentId || technician.department?.id) === selectedDepartmentId
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createAssignment.mutate(
      { complaintId, technicianId, notes },
      { onSuccess: () => router.push(returnTo) }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment details</CardTitle>
        <CardDescription>
          Select an assignable complaint and an active technician from its department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {complaints.isLoading ? (
          <Skeleton className="mb-4 h-10 w-full" />
        ) : complaints.isError ? (
          <p className="mb-4 text-sm text-destructive" role="alert">
            Could not load complaints. Confirm your role and department access.
          </p>
        ) : null}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium">
            Complaint
            <select
              required
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={complaintId}
              onChange={(event) => {
                setComplaintId(event.target.value);
                setTechnicianId("");
              }}
              disabled={complaints.isLoading || complaints.isError}
            >
              <option value="">Select a complaint</option>
              {assignableComplaints.map((complaint) => (
                <option key={complaint.id} value={complaint.id}>
                  {complaint.trackingCode} · {complaint.title}
                </option>
              ))}
            </select>
          </label>
          {!complaints.isLoading && !complaints.isError && !assignableComplaints.length && (
            <p className="text-sm text-muted-foreground">There are no assignable complaints in the latest 100 results.</p>
          )}
          {technicians.isError && (
            <p className="text-sm text-destructive" role="alert">
              Could not load technicians. Confirm your access and try again.
            </p>
          )}
          <label className="block space-y-2 text-sm font-medium">
            Technician
            <select
              required
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={technicianId}
              onChange={(event) => setTechnicianId(event.target.value)}
              disabled={!selectedComplaint || technicians.isLoading || technicians.isError}
            >
              <option value="">Select a technician</option>
              {eligibleTechnicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} · {technician.email}
                </option>
              ))}
            </select>
          </label>
          {selectedComplaint &&
            !technicians.isLoading &&
            !technicians.isError &&
            !selectedDepartmentId && (
              <p className="text-sm text-destructive" role="alert">
                This complaint is not linked to a department, so it cannot be assigned.
              </p>
            )}
          {selectedComplaint &&
            selectedDepartmentId &&
            !technicians.isLoading &&
            !technicians.isError &&
            !eligibleTechnicians.length && (
              <p className="text-sm text-muted-foreground">
                No active technicians are assigned to this department. In Admin → Users, set a
                technician&apos;s status to Active and assign them to this department.
              </p>
            )}
          <label className="block space-y-2 text-sm font-medium">
            Assignment notes
            <Textarea
              maxLength={1000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onPress={() => router.push(returnTo)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={
                createAssignment.isPending ||
                complaints.isLoading ||
                complaints.isError ||
                technicians.isLoading ||
                technicians.isError ||
                !technicianId ||
                !assignableComplaints.length
              }
            >
              {createAssignment.isPending ? "Creating..." : "Create assignment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
