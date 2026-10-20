import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

const steps = [
  {
    number: "01",
    title: "Tell us what happened",
    description: "Share the issue, its location, and any details that can help your city respond.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Your city takes action",
    description: "Your report is routed to the right team, so it can be reviewed and addressed.",
    icon: Building2,
  },
  {
    number: "03",
    title: "Follow every update",
    description: "Check your dashboard to see progress from submission through resolution.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b bg-muted/30">
          <div className="pointer-events-none absolute -top-32 right-0 size-[32rem] rounded-full bg-primary/5 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                <MapPin className="size-4 text-primary" />
                Your voice can improve your neighborhood
              </div>
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                A better city starts with{" "}
                <span className="text-primary">being heard.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Report local problems, connect with the right city team, and follow
                every update in one simple place.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Sign in to your account
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Your report stays connected to you and its progress.
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-2xl" />
              <div className="relative rounded-2xl border bg-card p-5 shadow-xl shadow-black/5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recent report</p>
                    <h2 className="mt-1 text-xl font-semibold">Streetlight outage</h2>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    In progress
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  Central Avenue, Ward 04
                </div>
                <div className="my-6 h-px bg-border" />
                <ol className="space-y-5">
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Report submitted</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Your city has received the details</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <span className="size-2 rounded-full bg-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Assigned to city team</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">A team is working on your report</p>
                    </div>
                  </li>
                  <li className="flex gap-3 opacity-50">
                    <span className="mt-0.5 size-6 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                    <div>
                      <p className="text-sm font-medium">Issue resolved</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">We&apos;ll let you know when it&apos;s done</p>
                    </div>
                  </li>
                </ol>
                <div className="mt-6 rounded-xl bg-muted/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">The result</p>
                  <p className="mt-1 text-sm">A clear view of what happens after you speak up.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From report to resolution
            </h2>
            <p className="mt-4 text-muted-foreground">
              CityCare makes it easier to raise an issue and stay informed while it is being handled.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <article key={number} className="rounded-2xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground/60">{number}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Ready to make a difference?</h2>
              <p className="mt-2 text-muted-foreground">Create an account and let your city know what needs attention.</p>
            </div>
            <Link
              href="/register"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Create your account
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
