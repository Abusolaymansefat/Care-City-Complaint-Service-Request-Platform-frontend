"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useComplaints";

export default function CitizenCategoriesPage() {
  const { data, isLoading, isError } = useCategories({ limit: 100, isActive: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Service Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the categories you can report issues under.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load categories</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No categories</CardTitle>
            <CardDescription>Categories will appear here once configured.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
                <CardDescription>
                  {category.description ?? "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <Badge variant="outline">{category.slaHours}h SLA</Badge>
                {category.department && (
                  <span className="text-xs text-muted-foreground">
                    {category.department.name}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
