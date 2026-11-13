"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useComplaints";
import { useDepartments } from "@/hooks/useDepartments";
import type { Category } from "@/types";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const departments = useDepartments({ limit: 100, sortBy: "name", sortOrder: "asc" });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [slaHours, setSlaHours] = useState(String(category?.slaHours ?? 72));
  const [departmentId, setDepartmentId] = useState(category?.departmentId ?? "");
  const mutation = category ? updateCategory : createCategory;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      name,
      description,
      slaHours: Number(slaHours),
      departmentId,
    };

    if (category) {
      updateCategory.mutate(
        { id: category.id, ...input },
        { onSuccess: () => router.push("/admin/categories") }
      );
    } else {
      createCategory.mutate(input, {
        onSuccess: () => router.push("/admin/categories"),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit category" : "Category details"}</CardTitle>
        <CardDescription>
          Set the service category, its department, and the response-time target.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {departments.isLoading ? (
          <Skeleton className="mb-4 h-10 w-full" />
        ) : departments.isError ? (
          <p className="mb-4 text-sm text-destructive" role="alert">
            Could not load departments. Refresh the page and try again.
          </p>
        ) : !departments.data?.data.length ? (
          <p className="mb-4 text-sm text-muted-foreground" role="alert">
            Create a department before adding a service category.
          </p>
        ) : null}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium">
            Name
            <Input
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Description
            <Textarea
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Response target (hours)
            <Input
              type="number"
              required
              min={1}
              max={8760}
              value={slaHours}
              onChange={(event) => setSlaHours(event.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Department
            <select
              required
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={departmentId}
              onChange={(event) => setDepartmentId(event.target.value)}
              disabled={departments.isLoading || !departments.data?.data.length}
            >
              <option value="">Select a department</option>
              {departments.data?.data.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onPress={() => router.push("/admin/categories")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={
                mutation.isPending ||
                departments.isLoading ||
                departments.isError ||
                !departments.data?.data.length
              }
            >
              {mutation.isPending
                ? "Saving..."
                : category
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
