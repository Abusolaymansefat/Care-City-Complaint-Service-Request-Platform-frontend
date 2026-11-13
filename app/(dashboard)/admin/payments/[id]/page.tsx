"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/hooks/usePayments";

export default function AdminPaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: payment, isLoading, isError } = usePayment(id);

  if (isLoading) return <Skeleton className="h-64 w-full max-w-2xl rounded-xl" />;

  if (isError || !payment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment not found</CardTitle>
          <CardDescription>This payment does not exist or is unavailable.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{payment.invoiceNumber}</CardTitle>
          <CardDescription>
            {payment.complaint?.title
              ? `${payment.complaint.trackingCode} · ${payment.complaint.title}`
              : payment.complaintId}
          </CardDescription>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>Payer: {payment.user?.name ?? payment.userId}</p>
        {payment.user?.email && <p>Email: {payment.user.email}</p>}
        <p>Amount: {payment.currency} {Number(payment.amount).toFixed(2)}</p>
        <p>Provider: {payment.provider}</p>
        <p>Timing: {payment.timing.replaceAll("_", " ")}</p>
        {payment.transactionId && <p>Transaction ID: {payment.transactionId}</p>}
        {payment.paidAt && <p>Paid at: {format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a")}</p>}
        {payment.failureReason && <p className="text-destructive">{payment.failureReason}</p>}
        <p className="text-muted-foreground">
          Created {format(new Date(payment.createdAt), "dd MMM yyyy, hh:mm a")}
        </p>
        {payment.paymentUrl &&
          (payment.status === "PENDING" || payment.status === "INITIATED") && (
            <a href={payment.paymentUrl} className={buttonVariants()}>
              Continue to bKash
            </a>
          )}
      </CardContent>
    </Card>
  );
}
