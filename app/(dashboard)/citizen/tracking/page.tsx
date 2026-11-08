"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Search, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackingCodeSchema, type TrackingCodeFormValues } from "@/lib/validations/complaint";

export default function CitizenTrackingSearchPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingCodeFormValues>({
    resolver: zodResolver(trackingCodeSchema),
    defaultValues: { trackingCode: "" },
  });
  const search = ({ trackingCode }: TrackingCodeFormValues) =>
    router.push(`/citizen/tracking/${encodeURIComponent(trackingCode)}`);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Track a complaint</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the tracking code from your complaint confirmation to see its latest status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScanSearch className="size-4" aria-hidden="true" />
            Find your complaint
          </CardTitle>
          <CardDescription>Your tracking code is shown in My complaints.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(search)}>
            <div className="space-y-2">
              <Label htmlFor="tracking-code">Tracking code</Label>
              <Input
                id="tracking-code"
                autoComplete="off"
                maxLength={100}
                placeholder="For example: CC-2026-1234"
                aria-invalid={Boolean(errors.trackingCode)}
                {...register("trackingCode")}
              />
              {errors.trackingCode && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.trackingCode.message}
                </p>
              )}
            </div>
            <Button type="submit">
              <Search aria-hidden="true" />
              Track complaint
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
