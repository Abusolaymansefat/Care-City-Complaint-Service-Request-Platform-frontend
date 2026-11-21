
"use client";

import { useParams } from "next/navigation";
import { AssignmentDetails } from "@/components/assignments/assignment-details";

export default function TechnicianAssignmentDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <AssignmentDetails
      id={params.id}
      role="technician"
    />
  );
}
