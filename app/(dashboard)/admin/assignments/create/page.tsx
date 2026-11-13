import { AssignmentForm } from "@/components/assignments/assignment-form";

export default function CreateAdminAssignmentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create assignment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Assign an eligible complaint to a technician in its department.
        </p>
      </div>
      <AssignmentForm returnTo="/admin/assignments" />
    </div>
  );
}
