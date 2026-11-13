"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteCategory, useCategories } from "@/hooks/useComplaints";
import { useDepartments } from "@/hooks/useDepartments";

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCategories({
    page,
    limit: 10,
    searchTerm: searchTerm.trim() || undefined,
    departmentId: departmentId || undefined,
    sortBy: "name",
    sortOrder: "asc",
  });
  const departments = useDepartments({ limit: 100, sortBy: "name", sortOrder: "asc" });
  const deactivateCategory = useDeleteCategory();

  const handleDeactivate = (id: string, name: string) => {
    if (window.confirm(`Deactivate "${name}"? It will no longer be offered to citizens.`)) {
      deactivateCategory.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the services citizens can select when reporting an issue.
          </p>
        </div>
        <LinkButton href="/admin/categories/create">
          <Plus aria-hidden="true" />
          Add category
        </LinkButton>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search categories"
            className="pl-9"
            placeholder="Search category names"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          aria-label="Filter by department"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={departmentId}
          onChange={(event) => {
            setDepartmentId(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All departments</option>
          {departments.data?.data.map((department) => (
            <option key={department.id} value={department.id}>{department.name}</option>
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
            <CardTitle>Could not load categories</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data.length ? (
        <Card>
          <CardHeader className="items-center text-center">
            <Tags className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
            <CardTitle>{searchTerm || departmentId ? "No matching categories" : "No categories yet"}</CardTitle>
            <CardDescription>
              {searchTerm || departmentId
                ? "Try changing the search or department filter."
                : "Create a category to make it available to citizens."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {data.data.length} of {data.meta?.total ?? data.data.length} categories
          </p>
          {data.data.map((category) => (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    <Link href={`/admin/categories/${category.id}`} className="hover:underline">
                      {category.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {category.description || "No description provided."}
                  </CardDescription>
                </div>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {category.department?.name ?? "No department"} · {category.slaHours}h target
                </span>
                <div className="flex gap-2">
                  <LinkButton href={`/admin/categories/${category.id}`} variant="outline">
                    Edit
                  </LinkButton>
                  {category.isActive && (
                    <Button
                      variant="destructive"
                      isDisabled={deactivateCategory.isPending}
                      onPress={() => handleDeactivate(category.id, category.name)}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </CardContent>
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
            <Button variant="outline" isDisabled={page <= 1 || isLoading} onPress={() => setPage((value) => value - 1)}>
              Previous
            </Button>
            <Button variant="outline" isDisabled={page >= data.meta.totalPages || isLoading} onPress={() => setPage((value) => value + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
