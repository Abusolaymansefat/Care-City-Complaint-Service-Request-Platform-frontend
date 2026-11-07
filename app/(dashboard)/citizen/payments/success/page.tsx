import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader className="items-center text-center">
        <CheckCircle2 className="mb-2 size-10 text-green-600" aria-hidden="true" />
        <CardTitle>Payment status updated</CardTitle>
        <CardDescription>
          Your payment provider has returned you to CityCare. Check your payment history for the
          latest transaction status.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-2">
        <LinkButton href="/payments">View payments</LinkButton>
        <Link href="/citizen/complaints" className="inline-flex h-8 items-center px-2.5 text-sm text-primary hover:underline">
          My complaints
        </Link>
      </CardContent>
    </Card>
  );
}