"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaint } from "@/hooks/useComplaints";

export default function OfficerComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: complaint, isLoading, isError } = useComplaint(id);

  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;

  if (isError || !complaint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load complaint</CardTitle>
          <CardDescription>This complaint is unavailable or your account cannot access it.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{complaint.title}</CardTitle>
            <CardDescription>
              {complaint.trackingCode} · Submitted {format(new Date(complaint.createdAt), "dd MMM yyyy")}
            </CardDescription>
          </div>
          <ComplaintStatusBadge status={complaint.status} />
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{complaint.description}</p>
          <p className="text-muted-foreground">
            {complaint.category?.name ?? "No category"} · {complaint.department?.name ?? "No department"} · {complaint.address}
          </p>
          {complaint.citizen && (
            <p>Reported by {complaint.citizen.name} · {complaint.citizen.email}</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Updates</CardTitle>
          <CardDescription>Status history for this complaint.</CardDescription>
        </CardHeader>
        <CardContent>
          {complaint.updates?.length ? (
            <ul className="space-y-4">
              {complaint.updates.map((update) => (
                <li key={update.id} className="border-l-2 border-border pl-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <ComplaintStatusBadge status={update.status} />
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(update.createdAt), "dd MMM yyyy, hh:mm a")}
                    </time>
                  </div>
                  {update.comment && <p className="mt-1 text-sm">{update.comment}</p>}
                  {update.updater && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated by {update.updater.name}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No updates have been recorded.</p>
          )}
        </CardContent>
      </Card>
      <Link href="/officer/complaints" className="text-sm font-medium text-primary hover:underline">
        Back to complaints
      </Link>
    </div>
  );
}
