"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDepartment, useUpdateDepartment } from "@/hooks/useDepartments";
import type { Department } from "@/types";

export default function AdminDepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: department, isLoading, isError } = useDepartment(id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit department</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the department details shown to citizens.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : isError || !department ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load department</CardTitle>
            <CardDescription>
              The department may have been removed. Return to the department list and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/departments" className="text-sm font-medium text-primary hover:underline">
              Back to departments
            </Link>
          </CardContent>
        </Card>
      ) : (
        <DepartmentForm key={department.id} department={department} />
      )}
    </div>
  );
}

function DepartmentForm({ department }: { department: Department }) {
  const router = useRouter();
  const updateDepartment = useUpdateDepartment();
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateDepartment.mutate(
      { id: department.id, name, description },
      { onSuccess: () => router.push("/admin/departments") }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{department.name}</CardTitle>
        <CardDescription>Edit the department name and description.</CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onPress={() => router.push("/admin/departments")}
            >
              Cancel
            </Button>
            <Button type="submit" isDisabled={updateDepartment.isPending}>
              {updateDepartment.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
