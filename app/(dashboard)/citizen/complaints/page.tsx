"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList, Plus } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyComplaints } from "@/hooks/useComplaints";

export default function CitizenComplaintsPage() {
  const { data, isLoading, isError } = useMyComplaints({ page: 1, limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My complaints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow the status and updates for issues you reported.
          </p>
        </div>
        <LinkButton href="/citizen/complaints/create-poster">
          <Plus aria-hidden="true" />
          Report an issue
        </LinkButton>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load complaints</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data.length ? (
        <Card>
          <CardHeader className="items-center text-center">
            <ClipboardList className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
            <CardTitle>No complaints yet</CardTitle>
            <CardDescription>Report an issue to start tracking its progress.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <LinkButton href="/citizen/complaints/create-poster">Report an issue</LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {data.data.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    <Link
                      href={`/citizen/complaints/${complaint.id}`}
                      className="hover:underline"
                    >
                      {complaint.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {complaint.trackingCode} · {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                  </CardDescription>
                </div>
                <ComplaintStatusBadge status={complaint.status} />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}