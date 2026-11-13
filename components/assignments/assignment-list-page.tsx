"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments } from "@/hooks/useComplaints";

export function AssignmentListPage({
  title,
  description,
  createHref,
  detailBase,
}: {
  title: string;
  description: string;
  createHref?: string;
  detailBase: string;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAssignments({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {createHref && <LinkButton href={createHref}>Create assignment</LinkButton>}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => <Skeleton key={item} className="h-24 w-full" />)}
        </div>
      ) : isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load assignments</CardTitle>
            <CardDescription>
              Confirm your department access and refresh the page.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data.length ? (
        <Card>
          <CardHeader className="items-center text-center">
            <ClipboardList className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
            <CardTitle>No assignments yet</CardTitle>
            <CardDescription>Assignments will appear here after complaints are assigned.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {data.data.length} of {data.meta?.total ?? data.data.length} assignments
          </p>
          {data.data.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    <Link href={`${detailBase}/${assignment.id}`} className="hover:underline">
                      {assignment.complaint.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {assignment.complaint.trackingCode} · {assignment.technician?.name ?? "Technician unavailable"} · Assigned {format(new Date(assignment.assignedAt), "dd MMM yyyy")}
                  </CardDescription>
                </div>
                <Badge variant={assignment.status === "COMPLETED" ? "default" : "secondary"}>
                  {assignment.status.replaceAll("_", " ")}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      {data?.meta && (
        <AssignmentListPagination
          page={page}
          totalPages={data.meta.totalPages}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export function AssignmentListPagination({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          isDisabled={page <= 1 || isLoading}
          onPress={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          isDisabled={page >= totalPages || isLoading}
          onPress={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
