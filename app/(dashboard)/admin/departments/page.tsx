"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteDepartment, useDepartments } from "@/hooks/useDepartments";

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDepartments({
    page,
    limit: 10,
    searchTerm: searchTerm.trim() || undefined,
    sortBy: "name",
    sortOrder: "asc",
  });
  const deleteDepartment = useDeleteDepartment();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteDepartment.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the departments that handle citizen complaints.
          </p>
        </div>
        <LinkButton href="/admin/departments/create">
          <Plus aria-hidden="true" />
          Add department
        </LinkButton>
      </div>

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Search departments"
          className="pl-9"
          placeholder="Search departments"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-24 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load departments</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data.length ? (
        <Card>
          <CardHeader className="items-center text-center">
            <Building2 className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
            <CardTitle>{searchTerm ? "No matching departments" : "No departments yet"}</CardTitle>
            <CardDescription>
              {searchTerm
                ? "Try another name or clear the search."
                : "Create a department to organize complaints."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {data.data.length} of {data.meta?.total ?? data.data.length} departments
          </p>
          {data.data.map((department) => (
            <Card key={department.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    <Link href={`/admin/departments/${department.id}`} className="hover:underline">
                      {department.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {department.description || "No description provided."}
                  </CardDescription>
                </div>
                <Badge variant={department.isActive ? "default" : "secondary"}>
                  {department.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <LinkButton href={`/admin/departments/${department.id}`} variant="outline">
                  <Pencil aria-hidden="true" />
                  Edit
                </LinkButton>
                <Button
                  variant="destructive"
                  isDisabled={deleteDepartment.isPending}
                  onPress={() => handleDelete(department.id, department.name)}
                >
                  <Trash2 aria-hidden="true" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total} departments
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
