import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import HomeBanner from "@/components/layout/home-banner";

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
        <HomeBanner />

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
