
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, MapPin, UserRound } from "lucide-react";

import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useComplaint } from "@/hooks/useComplaints";

export default function OfficerComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: complaint,
    isLoading,
    isError,
  } = useComplaint(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load complaint</CardTitle>
          <CardDescription>
            This complaint is unavailable or your account cannot access it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/officer/complaints"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to complaints
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/officer/complaints"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to complaints
      </Link>

      {/* Complaint information */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-xl">
              {complaint.title}
            </CardTitle>

            <CardDescription>
              Tracking ID: {complaint.trackingCode}
              {" · "}
              Submitted{" "}
              {format(
                new Date(complaint.createdAt),
                "dd MMM yyyy, hh:mm a",
              )}
            </CardDescription>
          </div>

          <ComplaintStatusBadge status={complaint.status} />
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {complaint.description}
            </p>
          </div>

          <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">
                {complaint.department?.name ?? "Not assigned"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">
                {complaint.category?.name ?? "Not assigned"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                Location
              </p>
              <p className="text-sm">{complaint.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Citizen information */}
      {complaint.citizen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-5" />
              Citizen information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Name: </span>
              {complaint.citizen.name}
            </p>

            <p>
              <span className="text-muted-foreground">Email: </span>
              {complaint.citizen.email}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Complaint updates */}
      <Card>
        <CardHeader>
          <CardTitle>Status history</CardTitle>
          <CardDescription>
            Track all recorded updates for this complaint.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {complaint.updates?.length ? (
            <ul className="space-y-5">
              {complaint.updates.map((update) => (
                <li
                  key={update.id}
                  className="border-l-2 border-border pl-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <ComplaintStatusBadge status={update.status} />

                    <time className="text-xs text-muted-foreground">
                      {format(
                        new Date(update.createdAt),
                        "dd MMM yyyy, hh:mm a",
                      )}
                    </time>
                  </div>

                  {update.comment && (
                    <p className="mt-2 text-sm">
                      {update.comment}
                    </p>
                  )}

                  {update.updater && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated by {update.updater.name}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No updates have been recorded.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
