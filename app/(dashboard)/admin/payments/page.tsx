"use client";

import { useState } from "react";
import { PaymentsList } from "@/components/payments/payments-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminPayments } from "@/hooks/usePayments";
import type { PaymentStatus } from "@/types";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const { data, isLoading, isError } = useAdminPayments({
    page,
    limit: 10,
    status: status || undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review payment records and their bKash transaction status.
        </p>
      </div>
      <select
        aria-label="Filter payments by status"
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value as PaymentStatus | "");
          setPage(1);
        }}
      >
        <option value="">All statuses</option>
        {(["PENDING", "INITIATED", "PAID", "FAILED", "CANCELLED"] as const).map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>

      {isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load payments</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <PaymentsList
          payments={data?.data}
          meta={data?.meta}
          isLoading={isLoading}
          page={page}
          onPageChange={setPage}
          emptyMessage="Payment transactions will appear here when citizens pay for complaints."
          showPayer
        />
      )}
    </div>
  );
}
