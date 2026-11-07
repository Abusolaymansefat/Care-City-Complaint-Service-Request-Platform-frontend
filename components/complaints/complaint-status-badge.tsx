import { Badge } from "@/components/ui/badge";
import type { ComplaintStatus, Priority } from "@/types";

const statusVariants: Record<
  ComplaintStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SUBMITTED: "outline",
  UNDER_REVIEW: "secondary",
  ASSIGNED: "secondary",
  IN_PROGRESS: "default",
  RESOLVED: "default",
  CLOSED: "outline",
  REJECTED: "destructive",
  REOPENED: "secondary",
  CANCELLED: "destructive",
};

const priorityVariants: Record<Priority, "default" | "secondary" | "destructive" | "outline"> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "default",
  URGENT: "destructive",
};

const label = (value: string) => value.replaceAll("_", " ");

export function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  return <Badge variant={statusVariants[status]}>{label(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant={priorityVariants[priority]}>{priority}</Badge>;
}
