"use client";

import { useParams } from "next/navigation";
import { AssignmentDetails } from "@/components/assignments/assignment-details";

export default function AdminAssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <AssignmentDetails id={id} role="admin" />;
}
