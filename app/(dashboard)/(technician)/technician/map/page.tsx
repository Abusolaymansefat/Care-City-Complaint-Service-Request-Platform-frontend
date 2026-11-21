
"use client";

import { useMemo, useState } from "react";
import { format, isPast, isValid } from "date-fns";
import {
  MapPin,
  Search,
  CalendarDays,
  ClipboardList,
  ExternalLink,
} from "lucide-react";

import { useAssignments } from "@/hooks/useComplaints";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianMapPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [selectedId, setSelectedId] = useState("");

  const { data, isLoading, isError } = useAssignments({
    page: 1,
    limit: 100,
  });

  const filteredAssignments = useMemo(() => {
    const assignments = data?.data ?? [];

    return assignments.filter((assignment) => {
      const complaint = assignment.complaint;

      const matchesSearch =
        complaint.title.toLowerCase().includes(search.toLowerCase()) ||
        complaint.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
        (complaint.address ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "ALL" || assignment.status === status;

      const matchesPriority =
        priority === "ALL" || complaint.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data, search, status, priority]);

  const selectedAssignment =
    filteredAssignments.find((item) => item.id === selectedId) ??
    filteredAssignments[0];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load locations</CardTitle>
          <CardDescription>
            Please check your assignment access and try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const complaint = selectedAssignment?.complaint;
  const lat = complaint?.latitude;
  const lng = complaint?.longitude;

  const hasCoordinates =
    typeof lat === "number" &&
    typeof lng === "number";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Map & Location</h1>
        <p className="text-sm text-muted-foreground">
          Search your assigned complaints and view their locations.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, tracking code, address..."
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Assignment List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Assigned Locations</h2>
            <Badge variant="secondary">
              {filteredAssignments.length} results
            </Badge>
          </div>

          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="font-medium">No assignments found</p>
                <p className="text-sm text-muted-foreground">
                  Try changing your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const item = assignment.complaint;
              const itemDue = item.slaDueAt
                ? new Date(item.slaDueAt)
                : null;

              const overdue =
                itemDue && isValid(itemDue) && isPast(itemDue);

              return (
                <Card
                  key={assignment.id}
                  className={
                    selectedAssignment?.id === assignment.id
                      ? "border-primary"
                      : ""
                  }
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.trackingCode}
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {assignment.status.replaceAll("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {item.priority}
                      </Badge>
                      {itemDue && isValid(itemDue) && (
                        <Badge variant={overdue ? "destructive" : "outline"}>
                          <CalendarDays className="mr-1 size-3" />
                          Due {format(itemDue, "dd MMM yyyy")}
                        </Badge>
                      )}
                    </div>

                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      {item.address || "Location unavailable"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => setSelectedId(assignment.id)}
                      >
                        View Location
                      </Button>

                      <LinkButton
                        href={`/technician/assignments/${assignment.id}`}
                        size="sm"
                      >
                        Assignment Details
                      </LinkButton>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Map */}
        <Card className="min-h-[420px] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" />
              Selected Location
            </CardTitle>
            <CardDescription>
              {complaint?.address || "Select an assignment to view its location"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {hasCoordinates ? (
              <div className="space-y-3">
                <iframe
                  title="Complaint location map"
                  src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
                  className="h-[300px] w-full rounded-lg border"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Open in Google Maps
                  <ExternalLink className="size-4" />
                </a>
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <MapPin className="mb-3 size-10 text-muted-foreground" />
                <p className="font-medium">Location unavailable</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This complaint has no saved coordinates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
