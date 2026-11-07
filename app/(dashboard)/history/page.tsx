"use client";

import { useState } from "react";
import { PaymentsList } from "@/components/payments/payments-list";
import { useMyPayments } from "@/hooks/usePayments";

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMyPayments({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payment history</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review your past and current transactions.</p>
      </div>
      {isError ? (
        <p role="alert" className="text-sm text-destructive">
          Could not load payment history. Please refresh and try again.
        </p>
      ) : (
        <PaymentsList
          payments={data?.data}
          meta={data?.meta}
          isLoading={isLoading}
          page={page}
          onPageChange={setPage}
          emptyMessage="Your payment transactions will appear here."
        />
      )}
    </div>
  );
}