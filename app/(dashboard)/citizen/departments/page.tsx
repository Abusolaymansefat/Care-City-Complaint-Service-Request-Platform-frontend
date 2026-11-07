"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/hooks/useComplaints";

export default function CitizenDepartmentsPage() {
  const { data, isLoading } = useDepartments({ limit: 100 });

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
      ) : !data?.data?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No departments</CardTitle>
            <CardDescription>Departments will appear here once configured.</CardDescription>
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
              </CardHeader>
              <CardContent>
                <Badge variant={department.isActive ? "default" : "destructive"}>
                  {department.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
