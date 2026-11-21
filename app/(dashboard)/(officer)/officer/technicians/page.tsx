
"use client";

import { useMemo, useState } from "react";
import { Search, Users, Wrench, Eye } from "lucide-react";

import { useDepartmentTechnicians } from "@/hooks/useUsers";

import { Input } from "@/components/ui/input";
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

export default function OfficerTechniciansPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useDepartmentTechnicians({
    page,
    limit: 10,
  });

  const technicians = useMemo(() => data?.data ?? [], [data]);

  const filteredTechnicians = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return technicians;

    return technicians.filter((technician) =>
      [
        technician.name,
        technician.email,
        technician.department?.name ?? "",
      ].some((value) => value.toLowerCase().includes(term)),
    );
  }, [technicians, search]);

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Department Technicians
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage technicians in your department.
          </p>
        </div>

        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1">
          <Users className="size-4" />
          {data?.meta?.total ?? technicians.length} Technicians
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load technicians</CardTitle>
            <CardDescription>
              Please check your department access and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : filteredTechnicians.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Users className="mb-3 size-10 text-muted-foreground" />
            <h3 className="font-semibold">No technicians found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No technicians match your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Technician cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTechnicians.map((technician) => (
              <Card key={technician.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Wrench className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">
                        {technician.name}
                      </CardTitle>
                      <CardDescription className="truncate">
                        {technician.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Department
                    </span>
                    <span className="text-sm font-medium">
                      {technician.department?.name ?? "Not assigned"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <Badge variant="default">Active</Badge>

                    <LinkButton
                      href={`/officer/technicians/${technician.id}`}
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="mr-2 size-4" />
                      View Details
                    </LinkButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  isDisabled={page <= 1}
                  onPress={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  isDisabled={page >= totalPages}
                  onPress={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
