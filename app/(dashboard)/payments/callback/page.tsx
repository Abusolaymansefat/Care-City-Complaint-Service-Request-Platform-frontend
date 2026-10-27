"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Payment result</CardTitle>
        <CardDescription>
          bKash sent you back to CityCare after completing the checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : status ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <PaymentStatusBadge status={status} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payment status was returned.</p>
        )}

        {payment?.failureReason && (
          <p className="text-sm text-destructive">{payment.failureReason}</p>
        )}

        <div className="flex gap-2">
          {paymentId && (
            <Link href={`/payments/${paymentId}`}>
              <Button variant="outline">View payment</Button>
            </Link>
          )}
          <Link href="/payments">
            <Button>Back to payments</Button>
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
