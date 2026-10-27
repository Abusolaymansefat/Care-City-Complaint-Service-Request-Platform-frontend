"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInitiatePayment } from "@/hooks/usePayments";

const schema = z.object({
  complaintId: z.string().uuid("Enter a valid complaint ID"),
});

type FormValues = z.infer<typeof schema>;

function NewPaymentForm() {
  const searchParams = useSearchParams();
  const initiate = useInitiatePayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      complaintId: searchParams.get("complaintId") ?? "",
    },
  });

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Pay with bKash</CardTitle>
        <CardDescription>
          Payment is required from your 3rd complaint onward. The fee is 10 BDT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) => initiate.mutate(values.complaintId))}
        >
          <FormField
            label="Complaint ID"
            placeholder="Complaint UUID"
            {...register("complaintId")}
            error={errors.complaintId?.message}
          />
          <Button type="submit" isDisabled={initiate.isPending}>
            {initiate.isPending ? "Starting payment..." : "Continue to bKash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 max-w-xl" />}>
      <NewPaymentForm />
    </Suspense>
  );
}
