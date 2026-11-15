
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, ScanSearch, ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  trackingCodeSchema,
  type TrackingCodeFormValues,
} from "@/lib/validations/complaint";

export default function CitizenTrackingSearchPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackingCodeFormValues>({
    resolver: zodResolver(trackingCodeSchema),
    defaultValues: {
      trackingCode: "",
    },
  });

  const onSubmit = ({ trackingCode }: TrackingCodeFormValues) => {
    router.push(
      `/citizen/tracking/${encodeURIComponent(trackingCode.trim())}`
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-primary">
          <ScanSearch className="size-4" />
          Complaint Tracking
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Track Your Complaint
        </h1>

        <p className="max-w-xl text-sm text-muted-foreground">
          Enter your unique complaint tracking code to check the latest
          progress and updates from your department.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border">
        <div className="h-1.5 bg-primary" />

        <CardHeader className="space-y-2 p-6">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Search className="size-6" />
          </div>

          <CardTitle className="text-xl">
            Find Your Complaint
          </CardTitle>

          <CardDescription>
            Your tracking code is available in the complaint confirmation.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="trackingCode">Tracking Code</Label>

              <Input
                id="trackingCode"
                placeholder="Example: CC-2026-1234"
                autoComplete="off"
                maxLength={100}
                className="h-12"
                aria-invalid={Boolean(errors.trackingCode)}
                {...register("trackingCode")}
              />

              {errors.trackingCode && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.trackingCode.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full"
              isDisabled={isSubmitting}
            >
              <Search className="mr-2 size-4" />
              Track Complaint
              <ArrowRight className="ml-auto size-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted/60 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-medium">
                Secure Complaint Tracking
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use your complaint tracking code to find the latest
                available information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
