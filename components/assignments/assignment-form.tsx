"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useComplaints, useCreateAssignment } from "@/hooks/useComplaints";

const assignableStatuses = new Set(["SUBMITTED", "UNDER_REVIEW", "REOPENED"]);

export function AssignmentForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const complaints = useComplaints({ page: 1, limit: 100 });
  const createAssignment = useCreateAssignment();
  const [complaintId, setComplaintId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [notes, setNotes] = useState("");
  const assignableComplaints = (complaints.data?.data ?? []).filter((complaint) =>
    assignableStatuses.has(complaint.status)
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
          Select an assignable complaint and enter an active technician&apos;s UUID from your department.
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
              onChange={(event) => setComplaintId(event.target.value)}
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
          <label className="block space-y-2 text-sm font-medium">
            Technician UUID
            <Input
              required
              minLength={36}
              maxLength={36}
              pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={technicianId}
              onChange={(event) => setTechnicianId(event.target.value)}
            />
          </label>
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
