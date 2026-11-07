"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComplaintStatusBadge } from "@/components/complaints/complaint-status-badge";
import { useMyComplaints } from "@/hooks/useComplaints";

export default function TrackingPage() {
  const params = useParams<{ trackingCode: string }>();
  const code = decodeURIComponent(params.trackingCode ?? "");
  const { data, isLoading, isError } = useMyComplaints({ searchTerm: code, limit: 100 });
  const complaint = useMemo(
    () =>
      (data?.data ?? []).find(
        (item) => item.trackingCode.toLowerCase() === code.toLowerCase()
      ),
    [data, code]
  );

  if (isLoading) return <Skeleton className="h-56 w-full" />;

  if (isError || !complaint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isError ? "Could not load tracking details" : "No complaint found"}</CardTitle>
          <CardDescription>
            {isError
              ? "Please try again in a moment."
              : `We could not find a complaint with tracking code ${code}.`}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate">{complaint.title}</CardTitle>
            <CardDescription className="mt-1">{complaint.trackingCode}</CardDescription>
          </div>
          <ComplaintStatusBadge status={complaint.status} />
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <div className="space-y-4 px-6 pb-6">
          {!complaint.updates?.length ? (
            <p className="text-sm text-muted-foreground">No updates yet.</p>
          ) : (
            complaint.updates.map((update) => (
              <div key={update.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{update.status.replaceAll("_", " ")}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(update.createdAt), "dd MMM yyyy, hh:mm a")}
                    </span>
                  </div>
                  {update.comment && (
                    <p className="mt-1 text-sm text-muted-foreground">{update.comment}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
      <Link
        href={`/citizen/complaints/${complaint.id}`}
        className="text-sm text-primary hover:underline"
      >
        View full details
      </Link>
    </div>
  );
}