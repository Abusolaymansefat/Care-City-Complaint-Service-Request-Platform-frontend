"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FilePlus2 } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useCreateComplaint } from "@/hooks/useComplaints";

export default function CreatePosterPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useCategories({ limit: 100, isActive: true });
  const createComplaint = useCreateComplaint();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const categories = data?.data ?? [];

  const submitComplaint = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createComplaint.mutate(
      { title: title.trim(), description: description.trim(), address: address.trim(), categoryId },
      {
        onSuccess: (complaint) => {
          router.push(`/citizen/complaints/${complaint.id}`);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <LinkButton
          href="/citizen/complaints"
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
        >
          <ArrowLeft aria-hidden="true" />
          My complaints
        </LinkButton>
        <h1 className="text-2xl font-semibold">Create a complaint</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the issue and where it is happening so the right city team can help.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FilePlus2 className="size-4" aria-hidden="true" />
            Complaint details
          </CardTitle>
          <CardDescription>Fields marked required must be completed.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p role="alert" className="text-sm text-destructive">
              Could not load service categories. Please refresh the page and try again.
            </p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              There are no active service categories yet. Please try again later.
            </p>
          ) : (
            <form className="space-y-5" onSubmit={submitComplaint}>
              <div className="space-y-2">
                <Label htmlFor="complaint-title">Issue title</Label>
                <Input
                  id="complaint-title"
                  required
                  minLength={5}
                  maxLength={150}
                  placeholder="For example: Streetlight not working"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-description">Description</Label>
                <Textarea
                  id="complaint-description"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  placeholder="Explain what happened, when you noticed it, and how it affects the area."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/3000 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-address">Location or address</Label>
                <Input
                  id="complaint-address"
                  required
                  minLength={5}
                  maxLength={300}
                  placeholder="Street, neighborhood, or a nearby landmark"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-category">Service category</Label>
                <select
                  id="complaint-category"
                  required
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" isDisabled={createComplaint.isPending}>
                  {createComplaint.isPending ? "Submitting..." : "Submit complaint"}
                </Button>
                <LinkButton href="/citizen/complaints" variant="outline">
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
