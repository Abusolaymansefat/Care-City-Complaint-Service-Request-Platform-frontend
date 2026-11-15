
"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, MapPin, CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { useMyComplaints } from "@/hooks/useComplaints";

export default function TrackingDetailsPage() {
  const params = useParams<{ trackingCode: string }>();
  const code = decodeURIComponent(params.trackingCode ?? "").trim();

  const { data, isLoading, isError } = useMyComplaints({
    searchTerm: code,
    limit: 100,
  });

  const complaint = useMemo(
    () =>
      (data?.data ?? []).find(
        (item) =>
          item.trackingCode.toLowerCase() === code.toLowerCase()
      ),
    [data, code]
  );

  const timeline = useMemo(() => {
    if (!complaint) return [];

    return [
      {
        id: "submitted",
        status: "SUBMITTED",
        comment: "Complaint submitted successfully.",
        createdAt: complaint.createdAt,
      },
      ...(complaint.updates ?? []),
    ].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [complaint]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <MapPin className="size-8 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-bold">
              {isError
                ? "Unable to Load Tracking Details"
                : "Complaint Not Found"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {isError
                ? "Please try again later."
                : `No complaint was found with tracking code ${code}.`}
            </p>

            <LinkButton href="/citizen/tracking" className="mt-6">
              <ArrowLeft className="mr-2 size-4" />
              Back to Tracking
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-primary">Complaint Tracking</p>
          <h1 className="text-2xl font-bold">Tracking Details</h1>
        </div>

        <LinkButton variant="outline" size="sm" href="/citizen/tracking">
          <ArrowLeft className="mr-2 size-4" />
          Track Another
        </LinkButton>
      </div>

      <Card className="overflow-hidden rounded-2xl">
        <div className="h-1.5 bg-primary" />

        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="outline">
              {complaint.trackingCode}
            </Badge>

            <ComplaintStatusBadge status={complaint.status} />
          </div>

          <CardTitle className="text-xl">
            {complaint.title}
          </CardTitle>

          <CardDescription className="leading-6">
            {complaint.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{complaint.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
              <CalendarDays className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">
                  {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {complaint.category && (
              <Badge variant="secondary">
                {complaint.category.name}
              </Badge>
            )}

            <Badge variant="outline">
              {complaint.priority}
            </Badge>
          </div>

          {!!complaint.imageUrls?.length && (
            <div className="space-y-3">
              <h3 className="font-semibold">Attached Photos</h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {complaint.imageUrls.map((url, index) => (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    key={url}
                    className="group overflow-hidden rounded-xl border"
                  >
                    <img
                      src={url}
                      alt={`Complaint attachment ${index + 1}`}
                      className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {!!complaint.videoUrls?.length && (
            <div className="space-y-3">
              <h3 className="font-semibold">Attached Videos</h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {complaint.videoUrls.map((url) => (
                  <video
                    key={url}
                    src={url}
                    controls
                    preload="metadata"
                    className="max-h-64 w-full rounded-xl border bg-black"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="size-5 text-primary" />
            Complaint Timeline
          </CardTitle>
          <CardDescription>
            Follow the progress of your complaint.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative space-y-6">
            {timeline.map((update, index) => (
              <div key={update.id} className="relative flex gap-4">
                {index !== timeline.length - 1 && (
                  <div className="absolute left-[9px] top-6 h-full w-px bg-border" />
                )}

                <span className="relative z-10 mt-1 size-5 shrink-0 rounded-full border-4 border-primary bg-background" />

                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {update.status.replaceAll("_", " ")}
                    </Badge>

                    <span className="text-xs text-muted-foreground">
                      {format(
                        new Date(update.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </span>
                  </div>

                  {update.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {update.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <LinkButton
        variant="outline"
        href={`/citizen/complaints/${complaint.id}`}
      >
        View Full Complaint Details
      </LinkButton>
    </div>
  );
}
