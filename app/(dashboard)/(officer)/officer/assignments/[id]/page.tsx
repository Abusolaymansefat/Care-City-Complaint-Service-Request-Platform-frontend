"use client";

import { useParams } from "next/navigation";
import { AssignmentDetails } from "@/components/assignments/assignment-details";

export default function OfficerAssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <AssignmentDetails id={id} role="officer" />;
}
