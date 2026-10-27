"use client";

import { useState } from "react";
import Link from "next/link";
import { PaymentsList } from "@/components/payments/payments-list";
import { Button } from "@/components/ui/button";
import { useMyPayments } from "@/hooks/usePayments";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPayments({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted-foreground">
            First 2 complaints are free. After that, each complaint needs a 10 BDT bKash payment.
          </p>
        </div>
        <Link href="/payments/new">
          <Button>Pay for a complaint</Button>
        </Link>
      </div>

      <PaymentsList
        payments={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        emptyMessage="When a complaint requires payment, start it here and finish on bKash."
      />
    </div>
  );
}
