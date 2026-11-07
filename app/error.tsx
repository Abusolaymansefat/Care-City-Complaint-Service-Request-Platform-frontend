"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">Unexpected error</p>
      <h1 className="text-2xl font-semibold tracking-tight">We couldn&apos;t load this page</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Something went wrong while loading this part of CityCare. Please try again.
      </p>
      <Button className="mt-6" onPress={retry}>
        <RotateCcw aria-hidden="true" />
        Try again
      </Button>
    </main>
  );
}