import { AssignmentListPage } from "@/components/assignments/assignment-list-page";

export default function AdminAssignmentsPage() {
  return (
    <AssignmentListPage
      title="Assignments"
      description="Review assignments across city departments."
      createHref="/admin/assignments/create"
      detailBase="/admin/assignments"
    />
  );
}
