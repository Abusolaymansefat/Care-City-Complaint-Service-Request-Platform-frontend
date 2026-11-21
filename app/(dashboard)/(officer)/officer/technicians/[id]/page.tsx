"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Building2,
  ClipboardList,
  Wrench,
} from "lucide-react";

import { useDepartmentTechnician } from "@/hooks/useUsers";
import { useAssignments } from "@/hooks/useComplaints";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OfficerTechnicianDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: technician,
    isLoading,
    isError,
  } = useDepartmentTechnician(id);

  const {
    data: assignmentData,
    isLoading: assignmentLoading,
  } = useAssignments({
    page: 1,
    limit: 100,
    technicianId: id,
  });

  const assignments = assignmentData?.data ?? [];

  const completedCount = assignments.filter(
    (item) => item.status === "COMPLETED",
  ).length;

  const activeCount = assignments.filter(
    (item) =>
      item.status === "ASSIGNED" ||
      item.status === "IN_PROGRESS",
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !technician) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technician not found</CardTitle>
          <CardDescription>
            Technician information is unavailable or you do not have permission.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LinkButton href="/officer/technicians" variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Back to Technicians
          </LinkButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <LinkButton
        href="/officer/technicians"
        variant="ghost"
        className="px-0"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Technicians
      </LinkButton>

      {/* Technician profile */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wrench className="size-7" />
              </div>

              <div>
                <CardTitle className="text-xl">
                  {technician.name}
                </CardTitle>
                <CardDescription>
                  Technician Profile
                </CardDescription>
              </div>
            </div>

            <Badge
              variant={
                technician.status === "ACTIVE"
                  ? "default"
                  : "secondary"
              }
            >
              {technician.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">
                {technician.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="mt-1 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium">
                {technician.department?.name ?? "Not assigned"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Assignments"
          value={assignmentData?.meta?.total ?? assignments.length}
        />

        <StatCard
          title="Active Assignments"
          value={activeCount}
        />

        <StatCard
          title="Completed Assignments"
          value={completedCount}
        />
      </div>

      {/* Assignment history */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
          <CardDescription>
            Complaints assigned to this technician.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {assignmentLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-20 w-full" />
              ))}
            </div>
          ) : assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {assignment.complaint.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {assignment.complaint.trackingCode}
                      {" · "}
                      {format(
                        new Date(assignment.assignedAt),
                        "dd MMM yyyy",
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        assignment.status === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {assignment.status.replaceAll("_", " ")}
                    </Badge>

                    <LinkButton
                      href={`/officer/assignments/${assignment.id}`}
                      size="sm"
                      variant="outline"
                    >
                      View
                    </LinkButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ClipboardList className="mx-auto mb-2 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No assignments found.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
