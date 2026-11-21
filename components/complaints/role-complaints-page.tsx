
"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Archive, ClipboardList, Search } from "lucide-react";

import { ComplaintStatusBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useAssignments,
  useComplaints,
  useDeleteComplaint,
} from "@/hooks/useComplaints";

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

interface RoleComplaintsPageProps {
  admin?: boolean;
}

export default function RoleComplaintsPage({
  admin = false,
}: RoleComplaintsPageProps) {
  const user = useAuthStore((state) => state.user);

  const isTechnician = user?.role === "TECHNICIAN";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ComplaintStatus | "">("");
  const [page, setPage] = useState(1);

  const deleteComplaint = useDeleteComplaint();

  // Department Officer and Admin complaint list
  const complaintQuery = useComplaints(
    {
      page,
      limit: 10,
      searchTerm: search.trim() || undefined,
      status: status || undefined,
    },
    !isTechnician,
  );

  // Technician sees only their assignments
  const assignmentQuery = useAssignments(
    { page: 1, limit: 100 },
    isTechnician,
  );

  const isLoading = isTechnician
    ? assignmentQuery.isLoading
    : complaintQuery.isLoading;

  const isError = isTechnician
    ? assignmentQuery.isError
    : complaintQuery.isError;

  const filteredAssignments = (assignmentQuery.data?.data ?? []).filter(
    (assignment) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        [
          assignment.complaint.title,
          assignment.complaint.trackingCode,
          assignment.status,
        ].some((value) => value.toLowerCase().includes(searchValue));

      const matchesStatus =
        !status || assignment.complaint.status === status;

      return matchesSearch && matchesStatus;
    },
  );

  const assignments = filteredAssignments.slice(
    (page - 1) * 10,
    page * 10,
  );

  const assignmentPageCount = Math.ceil(
    filteredAssignments.length / 10,
  );

  const complaints = complaintQuery.data?.data ?? [];

  const complaintPageCount =
    complaintQuery.data?.meta?.totalPages ?? 0;

  const pageCount = isTechnician
    ? assignmentPageCount
    : complaintPageCount;

  const title = admin
    ? "All complaints"
    : isTechnician
      ? "My assignments"
      : "Department complaints";

  const description = admin
    ? "Review and monitor complaints submitted across the city."
    : isTechnician
      ? "Review complaints assigned to you and their current status."
      : "Review complaints routed to your department.";

  const handleDelete = (id: string, complaintTitle: string) => {
    const confirmed = window.confirm(
      `Archive "${complaintTitle}"? Its payment and status history will be preserved.`,
    );

    if (confirmed) {
      deleteComplaint.mutate(id);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as ComplaintStatus | "");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            aria-label="Search complaints"
            className="pl-9"
            placeholder="Search title or tracking code..."
            value={search}
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
          />
        </div>

        <select
          aria-label="Filter by complaint status"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(event) =>
            handleStatusChange(event.target.value)
          }
        >
          <option value="">All statuses</option>

          {complaintStatuses.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load complaints</CardTitle>
            <CardDescription>
              Please check your account permissions and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : isTechnician ? (
        /* Technician assignments */
        assignments.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing {assignments.length} of{" "}
              {filteredAssignments.length} loaded assignments.
              {(assignmentQuery.data?.meta?.total ?? 0) > 100 &&
                " Search covers the latest 100 assignments."}
            </p>

            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="truncate text-base">
                      <Link
                        href={`/technician/assignments/${assignment.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {assignment.complaint.title}
                      </Link>
                    </CardTitle>

                    <CardDescription>
                      {assignment.complaint.trackingCode}
                      {" · "}
                      Assigned{" "}
                      {format(
                        new Date(assignment.assignedAt),
                        "dd MMM yyyy",
                      )}
                    </CardDescription>
                  </div>

                  <Badge
                    variant={
                      assignment.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }
                  >
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
      ) : (
        /* Department Officer / Admin complaints */
        complaints.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing {complaints.length} of{" "}
              {complaintQuery.data?.meta?.total ?? complaints.length}{" "}
              complaints
            </p>

            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="truncate text-base">
                      <Link
                        href={
                          admin
                            ? `/complaint/${complaint.id}`
                            : `/officer/complaints/${complaint.id}`
                        }
                        className="hover:text-primary hover:underline"
                      >
                        {complaint.title}
                      </Link>
                    </CardTitle>

                    <CardDescription>
                      {complaint.trackingCode}
                      {" · "}
                      {format(
                        new Date(complaint.createdAt),
                        "dd MMM yyyy",
                      )}
                    </CardDescription>
                  </div>

                  <ComplaintStatusBadge status={complaint.status} />
                </CardHeader>

                <CardContent className="flex flex-wrap gap-x-4 gap-y-2 pt-0 text-sm text-muted-foreground">
                  <span>
                    Department:{" "}
                    {complaint.department?.name ?? "Not assigned"}
                  </span>

                  <span>
                    Category:{" "}
                    {complaint.category?.name ?? "Not assigned"}
                  </span>

                  <span>Location: {complaint.address}</span>
                </CardContent>

                {admin && (
                  <CardContent className="flex justify-end pt-0">
                    <Button
                      variant="destructive"
                      isDisabled={deleteComplaint.isPending}
                      onPress={() =>
                        handleDelete(complaint.id, complaint.title)
                      }
                    >
                      <Archive className="mr-2 size-4" />
                      Archive
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyComplaints filtered={Boolean(search || status)} />
        )
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              isDisabled={page <= 1 || isLoading}
              onPress={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              isDisabled={page >= pageCount || isLoading}
              onPress={() =>
                setPage((current) =>
                  Math.min(pageCount, current + 1),
                )
              }
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
        <ClipboardList
          className="mb-2 size-8 text-muted-foreground"
          aria-hidden="true"
        />

        <CardTitle>
          {filtered ? "No matching complaints" : "No complaints yet"}
        </CardTitle>

        <CardDescription>
          {filtered
            ? "Try changing your search term or status filter."
            : "Complaints will appear here when they are submitted or assigned."}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
