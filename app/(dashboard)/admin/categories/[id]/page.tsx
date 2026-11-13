"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory } from "@/hooks/useComplaints";

export default function AdminCategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading, isError } = useCategory(id);

  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;

  if (isError || !category) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load category</CardTitle>
          <CardDescription>
            The category may have been removed.{" "}
            <Link href="/admin/categories" className="text-primary hover:underline">
              Return to categories.
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CategoryForm key={category.id} category={category} />
    </div>
  );
}
