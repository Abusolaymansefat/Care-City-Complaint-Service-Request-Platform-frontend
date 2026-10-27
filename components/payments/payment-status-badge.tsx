import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types";

const variants: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  INITIATED: "secondary",
  PENDING: "outline",
  FAILED: "destructive",
  CANCELLED: "destructive",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
