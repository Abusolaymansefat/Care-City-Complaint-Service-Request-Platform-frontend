"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useComplaint, useUpdateComplaint } from "@/hooks/useComplaints";

const editComplaintSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(150),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(3000),
  address: z.string().trim().min(5, "Location must be at least 5 characters.").max(300),
  categoryId: z.string().uuid("Choose a service category."),
});

type EditComplaintValues = z.infer<typeof editComplaintSchema>;

export default function EditComplaintPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: complaint, isLoading, isError } = useComplaint(id);
  const categories = useCategories({ limit: 100, isActive: true });
  const updateComplaint = useUpdateComplaint();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditComplaintValues>({
    resolver: zodResolver(editComplaintSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (complaint) {
      reset({
        title: complaint.title,
        description: complaint.description,
        address: complaint.address,
        categoryId: complaint.categoryId,
      });
    }
  }, [complaint, reset]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full max-w-2xl rounded-xl" />;
  }

  if (isError || !complaint) {
    return (
      <Card className="max-w-2xl" role="alert">
        <CardHeader>
          <CardTitle>Complaint not found</CardTitle>
          <CardDescription>This complaint does not exist or you cannot edit it.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/citizen/complaints">
            <Button variant="outline">Back to my complaints</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (complaint.status !== "SUBMITTED") {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>This complaint can no longer be edited</CardTitle>
          <CardDescription>
            Citizens can edit a complaint only before it has been reviewed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LinkButton href={`/citizen/complaints/${complaint.id}`} variant="outline">
            Back to complaint
          </LinkButton>
        </CardContent>
      </Card>
    );
  }

  if (categories.isError) {
    return (
      <Card className="max-w-2xl" role="alert">
        <CardHeader>
          <CardTitle>Could not load service categories</CardTitle>
          <CardDescription>Please refresh the page and try again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <LinkButton
          href={`/citizen/complaints/${complaint.id}`}
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2"
        >
          Back to complaint
        </LinkButton>
        <h1 className="text-2xl font-semibold">Edit complaint</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You can update your report while it is still awaiting review.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{complaint.trackingCode}</CardTitle>
          <CardDescription>Update the complaint details below.</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.isLoading ? (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleSubmit((values) =>
                updateComplaint.mutate(
                  {
                    id: complaint.id,
                    title: values.title,
                    description: values.description,
                    address: values.address,
                    ...(values.categoryId !== complaint.categoryId
                      ? { categoryId: values.categoryId }
                      : {}),
                  },
                  { onSuccess: () => router.push(`/citizen/complaints/${complaint.id}`) }
                )
              )}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-title">Issue title</Label>
                <Input id="edit-title" maxLength={150} {...register("title")} />
                {errors.title && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" maxLength={3000} rows={5} {...register("description")} />
                {errors.description && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Location or address</Label>
                <Input id="edit-address" maxLength={300} {...register("address")} />
                {errors.address && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Service category</Label>
                <select
                  id="edit-category"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  {...register("categoryId")}
                >
                  <option value="">Choose a category</option>
                  {!categories.data?.data.some((category) => category.id === complaint.categoryId) &&
                    complaint.category && (
                      <option value={complaint.categoryId}>
                        {complaint.category.name} (current)
                      </option>
                    )}
                  {categories.data?.data.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" isDisabled={updateComplaint.isPending}>
                  {updateComplaint.isPending ? "Saving..." : "Save changes"}
                </Button>
                <LinkButton href={`/citizen/complaints/${complaint.id}`} variant="outline">
                  Cancel
                </LinkButton>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
