"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck, CircleX, Clock3 } from "lucide-react";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/hooks/usePayments";
import type { PaymentStatus } from "@/types";

const isPaymentStatus = (value: string | null): value is PaymentStatus =>
  value === "PENDING" ||
  value === "INITIATED" ||
  value === "PAID" ||
  value === "FAILED" ||
  value === "CANCELLED";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") ?? undefined;
  const queryStatus = searchParams.get("status");
  const { data: payment, isLoading } = usePayment(paymentId);
  const status = payment?.status ?? (isPaymentStatus(queryStatus) ? queryStatus : null);
  const isPaid = status === "PAID";
  const isUnsuccessful = status === "FAILED" || status === "CANCELLED";

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader className="items-center text-center">
        <div
          className={`mb-2 flex size-16 items-center justify-center rounded-full ${
            isPaid
              ? "bg-emerald-100 text-emerald-600"
              : isUnsuccessful
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {isPaid ? (
            <CircleCheck className="size-9" aria-hidden="true" />
          ) : isUnsuccessful ? (
            <CircleX className="size-9" aria-hidden="true" />
          ) : (
            <Clock3 className="size-9" aria-hidden="true" />
          )}
        </div>
        <CardTitle>
          {isLoading
            ? "Checking payment"
            : isPaid
              ? "Payment successful"
              : isUnsuccessful
                ? "Payment not completed"
                : "Payment result"}
        </CardTitle>
        <CardDescription>
          {isLoading
            ? "Please wait while we confirm your transaction."
            : isPaid
              ? "Your payment has been received and the transaction is complete."
              : "Your payment status is shown below."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : status ? (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm text-muted-foreground">Status</span>
            <PaymentStatusBadge status={status} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payment status was returned.</p>
        )}

        {payment && (
          <dl className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium">
                {payment.currency} {Number(payment.amount).toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Invoice</dt>
              <dd className="font-medium">{payment.invoiceNumber}</dd>
            </div>
            {payment.complaint && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Complaint</dt>
                <dd className="text-right font-medium">
                  {payment.complaint.title} · {payment.complaint.trackingCode}
                </dd>
              </div>
            )}
          </dl>
        )}

        {payment?.failureReason && (
          <p className="text-sm text-destructive">{payment.failureReason}</p>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {paymentId && (
            <Link href={`/citizen/payments/${paymentId}`}>
              <Button variant="outline">View payment details</Button>
            </Link>
          )}
          {payment?.complaintId && !isPaid && (
            <Link href={`/citizen/payments/new?complaintId=${payment.complaintId}`}>
              <Button variant="outline">Try again</Button>
            </Link>
          )}
          <Link href="/citizen/payments">
            <Button>Back to payment history</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 max-w-xl" />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
