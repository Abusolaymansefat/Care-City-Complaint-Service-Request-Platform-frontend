
import { AssignmentListPage } from "@/components/assignments/assignment-list-page";

export default function TechnicianAssignmentsPage() {
  return (
    <AssignmentListPage
      title="My Assignments"
      description="View and manage complaints assigned to you."
      detailBase="/technician/assignments"
    />
  );
}
