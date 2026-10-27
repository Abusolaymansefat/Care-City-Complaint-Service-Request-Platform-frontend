"use client";

import Link from "next/link";
import { format } from "date-fns";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginationMeta, Payment } from "@/types";

const formatAmount = (amount: string | number, currency: string) =>
  `${currency} ${Number(amount).toFixed(2)}`;

export function PaymentsList({
  payments,
  meta,
  isLoading,
  page,
  onPageChange,
  emptyMessage,
  showPayer,
}: {
  payments?: Payment[];
  meta?: PaginationMeta;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  emptyMessage: string;
  showPayer?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No payments yet</CardTitle>
          <CardDescription>{emptyMessage}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>{payment.complaint?.title ?? payment.invoiceNumber}</CardTitle>
                <CardDescription>
                  {payment.complaint?.trackingCode
                    ? `${payment.complaint.trackingCode} · `
                    : ""}
                  {payment.invoiceNumber}
                  {showPayer && payment.user ? ` · ${payment.user.name}` : ""}
                </CardDescription>
              </div>
              <PaymentStatusBadge status={payment.status} />
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {formatAmount(payment.amount, payment.currency)} ·{" "}
                {format(new Date(payment.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
              <div className="flex gap-2">
                {payment.paymentUrl &&
                  (payment.status === "PENDING" || payment.status === "INITIATED") && (
                    <a
                      href={payment.paymentUrl}
                      className={buttonVariants({ size: "sm" })}
                    >
                      Continue bKash
                    </a>
                  )}
                <Link
                  href={`/payments/${payment.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            isDisabled={page <= 1}
            onPress={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            isDisabled={page >= meta.totalPages}
            onPress={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
