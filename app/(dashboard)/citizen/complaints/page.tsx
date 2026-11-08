"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { ClipboardList, MapPin, Plus, Search } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyComplaints } from "@/hooks/useComplaints";

export default function CitizenComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMyComplaints({
    page,
    limit: 10,
    searchTerm: searchTerm.trim() || undefined,
  });

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

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Search my complaints"
          className="pl-9"
          placeholder="Search title, tracking code, or location"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
        />
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
            <CardTitle>{searchTerm ? "No matching complaints" : "No complaints yet"}</CardTitle>
            <CardDescription>
              {searchTerm
                ? "Try another title, tracking code, or location."
                : "Report an issue to start tracking its progress."}
            </CardDescription>
          </CardHeader>
          {!searchTerm && (
            <CardContent className="flex justify-center">
              <LinkButton href="/citizen/complaints/create-poster">Report an issue</LinkButton>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {data.data.length} of {data.meta?.total ?? data.data.length} complaints
          </p>
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
              <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                  {complaint.category && <span>{complaint.category.name}</span>}
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {complaint.address}
                  </span>
                  {!!complaint.imageUrls?.length && (
                    <span>{complaint.imageUrls.length} attached photo{complaint.imageUrls.length === 1 ? "" : "s"}</span>
                  )}
                  {!!complaint.videoUrls?.length && (
                    <span>{complaint.videoUrls.length} attached video{complaint.videoUrls.length === 1 ? "" : "s"}</span>
                  )}
                </div>
                <Link
                  href={`/citizen/tracking/${encodeURIComponent(complaint.trackingCode)}`}
                  className="font-medium text-primary hover:underline"
                >
                  Track status
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total} complaints
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              isDisabled={page <= 1 || isLoading}
              onPress={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              isDisabled={page >= data.meta.totalPages || isLoading}
              onPress={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}