"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" aria-hidden="true" />
          </div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">CityCare error</p>
          <h1 className="text-2xl font-semibold tracking-tight">The app hit an unexpected error</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Please try loading the application again.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}