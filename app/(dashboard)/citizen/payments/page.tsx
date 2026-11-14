"use client";

import { useState } from "react";
import Link from "next/link";
import { PaymentsList } from "@/components/payments/payments-list";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyPayments } from "@/hooks/usePayments";

export default function CitizenPaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMyPayments({ page, limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Payment history</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your payment records and open any transaction for its full details.
          </p>
        </div>
        <Link href="/citizen/complaints">
          <Button>Select a complaint to pay</Button>
        </Link>
      </div>

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
          emptyMessage="When a complaint requires payment, start it here and finish on bKash."
          detailBasePath="/citizen/payments"
        />
      )}
    </div>
  );
}
