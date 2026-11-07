import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-7" aria-hidden="true" />
      </div>
      <p className="mb-2 text-sm font-medium text-primary">404 · Page not found</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page isn&apos;t here</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The address may be incorrect, or the page may have moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/" variant="outline">
          <ArrowLeft aria-hidden="true" />
          Back to CityCare
        </LinkButton>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </main>
  );
}