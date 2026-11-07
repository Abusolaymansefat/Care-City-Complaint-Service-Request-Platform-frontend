"use client";

import { useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
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
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex w-full max-w-3xl flex-col items-center">
        <Image
          src="/error.webp"
          alt="Illustration representing an unexpected application error"
          width={788}
          height={1000}
          priority
          className="mb-6 h-[min(52vh,440px)] w-full object-contain"
        />
        <p className="mb-2 text-sm font-medium text-muted-foreground">Unexpected error</p>
        <h1 className="text-2xl font-semibold tracking-tight">We couldn&apos;t load this page</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Something went wrong while loading this part of CityCare. Please try again.
        </p>
        <Button className="mt-6" onPress={retry}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      </div>
    </main>
  );
}