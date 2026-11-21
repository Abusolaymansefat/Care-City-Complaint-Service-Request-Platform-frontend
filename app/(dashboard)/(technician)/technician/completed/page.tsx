
"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { CheckCircle2, Search, CalendarCheck } from "lucide-react";

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

export default function TechnicianCompletedPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useAssignments({
    page: 1,
    limit: 100,
  });

  const completedAssignments = (data?.data ?? []).filter(
    (item) => item.status === "COMPLETED"
  );

  const filtered = completedAssignments.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.complaint.title.toLowerCase().includes(query) ||
      item.complaint.trackingCode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Completed Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Review your completed assignments and resolution information.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Completed
              </p>
              <p className="mt-2 text-3xl font-bold">
                {completedAssignments.length}
              </p>
            </div>
            <CheckCircle2 className="size-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Search Results
              </p>
              <p className="mt-2 text-3xl font-bold">
                {filtered.length}
              </p>
            </div>
            <Search className="size-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search completed tasks..."
          className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load completed tasks</CardTitle>
            <CardDescription>
              Please refresh and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="mx-auto mb-3 size-10 text-muted-foreground" />
            <p className="font-semibold">No completed tasks found</p>
            <p className="text-sm text-muted-foreground">
              Your completed assignments will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((assignment) => {
            const completedAt = assignment.completedAt
              ? new Date(assignment.completedAt)
              : null;

            return (
              <Card key={assignment.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base">
                      {assignment.complaint.title}
                    </CardTitle>
                    <CardDescription>
                      {assignment.complaint.trackingCode}
                    </CardDescription>
                  </div>

                  <Badge className="bg-green-600 text-white hover:bg-green-600">
                    Completed
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Completed:
                      </span>
                      <span>
                        {completedAt && isValid(completedAt)
                          ? format(completedAt, "dd MMM yyyy, hh:mm a")
                          : "Date unavailable"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">
                        Priority:{" "}
                      </span>
                      <span>{assignment.complaint.priority}</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-1 text-sm font-medium">
                      Resolution Notes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.notes || "No resolution notes available."}
                    </p>
                  </div>

                  <LinkButton
                    href={`/technician/assignments/${assignment.id}`}
                    size="sm"
                    variant="outline"
                  >
                    View Assignment Details
                  </LinkButton>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
