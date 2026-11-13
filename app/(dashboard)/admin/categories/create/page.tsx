import { CategoryForm } from "@/components/admin/category-form";

export default function CreateAdminCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create category</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a service category for citizens to choose when reporting issues.
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
