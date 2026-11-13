import { AssignmentListPage } from "@/components/assignments/assignment-list-page";

export default function OfficerAssignmentsPage() {
  return (
    <AssignmentListPage
      title="Department assignments"
      description="Review assignments for complaints handled by your department."
      createHref="/officer/assignments/create"
      detailBase="/officer/assignments"
    />
  );
}
