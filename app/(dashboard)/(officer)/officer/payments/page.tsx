"use client";

import { useState } from "react";
import { PaymentsList } from "@/components/payments/payments-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartmentPayments } from "@/hooks/usePayments";
import type { PaymentPeriod, PaymentStatus } from "@/types";

export default function OfficerPaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [period, setPeriod] = useState<PaymentPeriod>("all");
  const { data, isLoading, isError } = useDepartmentPayments({
    page,
    limit: 10,
    status: status || undefined,
    period,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Department payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Payment records for complaints assigned to your department.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          aria-label="Filter payments by time period"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={period}
          onChange={(event) => {
            setPeriod(event.target.value as PaymentPeriod);
            setPage(1);
          }}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="1m">Last month</option>
          <option value="1y">Last year</option>
        </select>
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
      </div>

      {isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load department payments</CardTitle>
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
          emptyMessage="Payment transactions for your department will appear here."
          showPayer
          allowContinuePayment={false}
        />
      )}
    </div>
  );
}
