import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex w-full max-w-3xl flex-col items-center">
        <Image
          src="/error-page-not.webp"
          alt="Illustration of a broken connection for this 404 page"
          width={800}
          height={600}
          priority
          className="mb-6 h-[min(52vh,440px)] w-full object-contain"
        />
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
      </div>
    </main>
  );
}