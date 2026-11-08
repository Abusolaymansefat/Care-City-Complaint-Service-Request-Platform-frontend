"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { LinkButton } from "@/components/ui/button";
import { useMyComplaints } from "@/hooks/useComplaints";

export default function TrackingPage() {
  const params = useParams<{ trackingCode: string }>();
  const code = params.trackingCode?.trim() ?? "";
  const { data, isLoading, isError } = useMyComplaints({ searchTerm: code, limit: 100 });
  const complaint = useMemo(
    () =>
      (data?.data ?? []).find(
        (item) => item.trackingCode.toLowerCase() === code.toLowerCase()
      ),
    [data, code]
  );
  const timeline = useMemo(() => {
    if (!complaint) return [];
    return [
      {
        id: "submitted",
        status: "SUBMITTED" as const,
        comment: "Complaint submitted",
        createdAt: complaint.createdAt,
      },
      ...(complaint.updates ?? []),
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [complaint]);

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
        <CardContent className="space-y-3 text-sm">
          <p className="whitespace-pre-line text-muted-foreground">{complaint.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {complaint.address}
            </span>
            {complaint.category && <span>{complaint.category.name}</span>}
            <span>Submitted {format(new Date(complaint.createdAt), "dd MMM yyyy, hh:mm a")}</span>
          </div>
          {!!complaint.imageUrls?.length && (
            <div className="space-y-2 pt-2">
              <h2 className="text-sm font-medium">Attached photos</h2>
              <ul className="flex flex-wrap gap-2">
                {complaint.imageUrls.map((imageUrl, index) => (
                  <li key={imageUrl}>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline underline-offset-4"
                    >
                      View photo {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!complaint.videoUrls?.length && (
            <div className="space-y-2 pt-2">
              <h2 className="text-sm font-medium">Attached videos</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {complaint.videoUrls.map((videoUrl) => (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    preload="metadata"
                    className="max-h-64 w-full rounded-lg border bg-black"
                  >
                    <a href={videoUrl}>Download video</a>
                  </video>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <div className="space-y-4 px-6 pb-6">
          {timeline.map((update) => (
              <div key={update.id} className="relative flex gap-3 pb-2 last:pb-0">
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
            ))}
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <LinkButton href={`/citizen/complaints/${complaint.id}`} variant="outline">
          View full details
        </LinkButton>
        <Link
          href="/citizen/tracking"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Track another complaint
        </Link>
      </div>
    </div>
  );
}