"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CitizenTrackingSearchPage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState("");

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = trackingCode.trim();
    if (code) router.push(`/citizen/tracking/${encodeURIComponent(code)}`);
  };

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
          <form className="space-y-4" onSubmit={search}>
            <div className="space-y-2">
              <Label htmlFor="tracking-code">Tracking code</Label>
              <Input
                id="tracking-code"
                required
                autoComplete="off"
                placeholder="For example: CC-2026-1234"
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
              />
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
