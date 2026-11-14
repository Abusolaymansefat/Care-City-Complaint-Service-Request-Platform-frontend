"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useComplaint } from "@/hooks/useComplaints";
import { useInitiatePayment } from "@/hooks/usePayments";

function PaymentMethodContent() {
  const searchParams = useSearchParams();
  const complaintId = searchParams.get("complaintId") ?? undefined;
  const { data: complaint, isLoading, isError } = useComplaint(complaintId);
  const initiate = useInitiatePayment();

  if (!complaintId) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Select a complaint first</CardTitle>
          <CardDescription>
            Open a complaint that requires payment, then choose its payment option.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/citizen/complaints">
            <Button>View my complaints</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-72 w-full max-w-2xl rounded-xl" />;
  }

  if (isError || !complaint) {
    return (
      <Card className="max-w-2xl" role="alert">
        <CardHeader>
          <CardTitle>Could not load complaint</CardTitle>
          <CardDescription>
            The complaint may no longer be available. Return to your complaints and try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/citizen/complaints">
            <Button variant="outline">View my complaints</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!complaint.paymentRequired) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Payment is not required</CardTitle>
          <CardDescription>
            This complaint does not currently have an outstanding payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/citizen/complaints/${complaint.id}`}>
            <Button variant="outline">Back to complaint</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Review your payment</CardTitle>
          <CardDescription>
            Confirm the complaint and choose the available payment method.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="font-medium">{complaint.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Complaint {complaint.trackingCode}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Complaint ID: {complaint.id}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium">Payment method</h2>
            <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-pink-600 text-white">
                <Smartphone className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">bKash</p>
                <p className="text-sm text-muted-foreground">
                  Secure mobile payment
                </p>
              </div>
              <span className="text-xs font-medium text-primary">Available</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4 text-sm">
            <span className="text-muted-foreground">Complaint payment</span>
            <span className="font-semibold">BDT 10.00</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              isDisabled={initiate.isPending}
              onPress={() => initiate.mutate(complaint.id)}
            >
              {initiate.isPending ? "Connecting to bKash..." : "Pay with bKash"}
            </Button>
            <Link href={`/citizen/complaints/${complaint.id}`}>
              <Button variant="outline">
                <ArrowLeft aria-hidden="true" />
                Back to complaint
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full max-w-2xl rounded-xl" />}>
      <PaymentMethodContent />
    </Suspense>
  );
}
