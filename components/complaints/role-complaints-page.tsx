"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments, useComplaints } from "@/hooks/useComplaints";
import { useAuthStore } from "@/store/auth.store";
import type { ComplaintStatus } from "@/types";

const complaintStatuses: ComplaintStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
  "REOPENED",
  "CANCELLED",
];

export default function RoleComplaintsPage({ admin = false }: { admin?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const technician = user?.role === "TECHNICIAN";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ComplaintStatus | "">("");
  const [page, setPage] = useState(1);
  const complaintQuery = useComplaints({
    page,
    limit: 10,
    searchTerm: search.trim() || undefined,
    status: status || undefined,
  }, !technician);
  const assignmentQuery = useAssignments({ page: 1, limit: 100 }, technician);
  const isLoading = technician ? assignmentQuery.isLoading : complaintQuery.isLoading;
  const isError = technician ? assignmentQuery.isError : complaintQuery.isError;
  const filteredAssignments = (assignmentQuery.data?.data ?? []).filter((assignment) => {
    const matchesText = !search.trim() || [
      assignment.complaint.title,
      assignment.complaint.trackingCode,
      assignment.status,
    ].some((value) => value.toLowerCase().includes(search.trim().toLowerCase()));
    const matchesStatus = !status || assignment.complaint.status === status;
    return matchesText && matchesStatus;
  });
  const assignments = filteredAssignments.slice((page - 1) * 10, page * 10);
  const assignmentPageCount = Math.ceil(filteredAssignments.length / 10);
  const complaints = complaintQuery.data?.data ?? [];
  const complaintPageCount = complaintQuery.data?.meta?.totalPages ?? 0;
  const pageCount = technician ? assignmentPageCount : complaintPageCount;
  const title = admin
    ? "All complaints"
    : technician
      ? "My assignments"
      : "Department complaints";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {admin
            ? "Review and monitor complaints submitted across the city."
            : technician
              ? "Review complaints assigned to you and their current status."
              : "Review complaints routed to your department."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search complaints"
            className="pl-9"
            placeholder="Search title or tracking code"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          aria-label="Filter by complaint status"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as ComplaintStatus | "");
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {complaintStatuses.map((value) => (
            <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => <Skeleton key={item} className="h-24 w-full" />)}
        </div>
      ) : isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load complaints</CardTitle>
            <CardDescription>
              Please check your role and department access, then refresh the page.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : technician ? (
        assignments.length ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing {assignments.length} of {filteredAssignments.length} loaded assignments
              {(assignmentQuery.data?.meta?.total ?? 0) > 100 && " (search covers the latest 100)"}
            </p>
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">
                      <Link href={`/technician/assignments/${assignment.id}`} className="hover:underline">
                        {assignment.complaint.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {assignment.complaint.trackingCode} · Assigned {format(new Date(assignment.assignedAt), "dd MMM yyyy")}
                    </CardDescription>
                  </div>
                  <Badge variant={assignment.status === "COMPLETED" ? "default" : "secondary"}>
                    {assignment.status.replaceAll("_", " ")}
                  </Badge>
                </CardHeader>
                {assignment.notes && (
                  <CardContent className="pt-0 text-sm text-muted-foreground">
                    {assignment.notes}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyComplaints filtered={Boolean(search || status)} />
        )
      ) : complaints.length ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {complaints.length} of {complaintQuery.data?.meta?.total ?? complaints.length} complaints
          </p>
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    <Link href={`/officer/complaints/${complaint.id}`} className="hover:underline">
                      {complaint.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {complaint.trackingCode} · {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                  </CardDescription>
                </div>
                <ComplaintStatusBadge status={complaint.status} />
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-0 text-sm text-muted-foreground">
                <span>{complaint.department?.name ?? "No department"}</span>
                <span>{complaint.category?.name ?? "No category"}</span>
                <span>{complaint.address}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyComplaints filtered={Boolean(search || status)} />
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
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
              isDisabled={
                isLoading ||
                page >= pageCount
              }
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

function EmptyComplaints({ filtered }: { filtered: boolean }) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <ClipboardList className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
        <CardTitle>{filtered ? "No matching complaints" : "No complaints yet"}</CardTitle>
        <CardDescription>
          {filtered
            ? "Try changing the search term or status filter."
            : "Complaints will appear here when they are submitted or assigned."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
