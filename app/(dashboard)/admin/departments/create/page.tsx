"use client";

import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment } from "@/hooks/useDepartments";

export default function CreateAdminDepartmentPage() {
  const router = useRouter();
  const createDepartment = useCreateDepartment();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createDepartment.mutate(
      { name, description },
      { onSuccess: () => router.push("/admin/departments") }
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create department</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a department to the city service directory.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Department details</CardTitle>
          <CardDescription>Enter the department name and an optional description.</CardDescription>
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
              <Button type="submit" isDisabled={createDepartment.isPending}>
                {createDepartment.isPending ? "Creating..." : "Create department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
