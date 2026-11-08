"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComplaintStatusBadge, PriorityBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { useComplaint } from "@/hooks/useComplaints";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";

export default function ComplaintDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: complaint, isLoading, isError } = useComplaint(params.id);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !complaint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complaint not found</CardTitle>
          <CardDescription>This complaint does not exist or you cannot view it.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate">{complaint.title}</CardTitle>
            <CardDescription className="mt-1">{complaint.trackingCode}</CardDescription>
          </div>
          <ComplaintStatusBadge status={complaint.status} />
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="whitespace-pre-line text-muted-foreground">{complaint.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {complaint.address}
            </span>
            <PriorityBadge priority={complaint.priority} />
            <span>Submitted {format(new Date(complaint.createdAt), "dd MMM yyyy, hh:mm a")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {complaint.paymentRequired && (
              <Button
                onPress={() => {
                  router.push(`/payments/new?complaintId=${complaint.id}`);
                }}
              >
                Pay 10 BDT with bKash
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!complaint.updates?.length ? (
            <p className="text-sm text-muted-foreground">No updates yet.</p>
          ) : (
            complaint.updates.map((update) => (
              <div key={update.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{update.status.replaceAll("_", " ")}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(update.createdAt), "dd MMM yyyy, hh:mm a")}
                    </span>
                  </div>
                  {update.comment && (
                    <p className="mt-1 text-sm text-muted-foreground">{update.comment}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {complaint.payments?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {complaint.payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {payment.currency} {Number(payment.amount).toFixed(2)}
                </span>
                <PaymentStatusBadge status={payment.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
