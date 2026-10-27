"use client";

import { useState } from "react";
import { PaymentsList } from "@/components/payments/payments-list";
import { useAdminPayments } from "@/hooks/usePayments";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPayments({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-muted-foreground">All citizen complaint payments across the platform.</p>
      </div>

      <PaymentsList
        payments={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        emptyMessage="No payments have been initiated yet."
        showPayer
      />
    </div>
  );
}
