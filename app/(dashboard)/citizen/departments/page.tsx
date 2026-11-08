"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/hooks/useComplaints";

export default function CitizenDepartmentsPage() {
  const { data, isLoading, isError } = useDepartments({ limit: 100 });
  const departments = (data?.data ?? []).filter((department) => department.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Departments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          City departments handling complaints and service requests.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load departments</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !departments.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No active departments</CardTitle>
            <CardDescription>Active city departments will appear here.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card key={department.id}>
              <CardHeader>
                <CardTitle className="text-base">{department.name}</CardTitle>
                <CardDescription>
                  {department.description ?? "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <Badge variant="default">Active</Badge>
                <span className="text-xs text-muted-foreground">City service department</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
