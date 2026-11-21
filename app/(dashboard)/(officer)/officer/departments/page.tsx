"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/hooks/useDepartments";

export default function OfficerDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDepartments({
    page,
    limit: 12,
    searchTerm: searchTerm.trim() || undefined,
    sortBy: "name",
    sortOrder: "asc",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Departments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse city departments handling complaints and service requests.
        </p>
      </div>

      <div className="max-w-md">
        <Input
          aria-label="Search departments"
          placeholder="Search departments"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load departments</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data.length ? (
        <Card>
          <CardHeader>
            <CardTitle>{searchTerm ? "No matching departments" : "No departments found"}</CardTitle>
            <CardDescription>
              {searchTerm ? "Try another department name." : "Departments will appear here when available."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((department) => (
            <Card key={department.id}>
              <CardHeader>
                <CardTitle className="text-base">{department.name}</CardTitle>
                <CardDescription>
                  {department.description ?? "No description provided."}
                </CardDescription>
                <Badge variant={department.isActive ? "default" : "secondary"} className="w-fit">
                  {department.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
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
