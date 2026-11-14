import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Footer from "@/components/layout/footer";
import ReportIssueLink from "@/components/layout/report-issue-link";

export const metadata: Metadata = {
  title: "About CityCare",
  description:
    "Learn about CityCare — the platform that helps citizens report city issues and track them through resolution.",
};

const faqs = [
  {
    question: "How do I report a city issue?",
    answer:
      "Click “Report an issue”, sign in or create an account, then share what happened, the location, and any photos or details that can help. Your report is routed to the right city team automatically.",
  },
  {
    question: "How can I track my complaint?",
    answer:
      "Once you submit a report you receive a tracking code. You can follow its progress — from submission to resolution — anytime from your citizen dashboard.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes. Your contact details are only shared with the city teams handling your report. Public complaint views hide your personal information.",
  },
  {
    question: "What happens after I submit a report?",
    answer:
      "Your report is reviewed and assigned to the appropriate department or officer. You’ll see status updates on your dashboard as it moves through review, assignment, and resolution.",
  },
  {
    question: "Can I report an issue without an account?",
    answer:
      "You can browse public complaints without an account, but submitting a new report requires signing in so we can route it and send you updates.",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            About CityCare
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Helping citizens and cities work together
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            CityCare is a civic complaint platform that makes it simple to report city issues —
            broken roads, drainage problems, sanitation, and more — and follow them until they’re
            resolved.
          </p>
        </section>

        {/* What we do */}
        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              title: "Easy reporting",
              description:
                "Describe the issue, drop a pin on the location, and attach photos — no paperwork, no queues.",
            },
            {
              icon: Building2,
              title: "Smart routing",
              description:
                "Reports are sent to the right department or officer based on category, location, and priority.",
            },
            {
              icon: CheckCircle2,
              title: "Transparent tracking",
              description:
                "Every report has a tracking code so citizens can see real progress from submission to fix.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </section>

        {/* Contact */}
        <section className="mt-16 rounded-2xl border bg-muted/30 p-8 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
            <p className="mt-2 text-muted-foreground">
              Questions about the platform or need help with a report? Reach out to our team.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Mail, label: "Email", value: "support@citycare.example" },
              { icon: Phone, label: "Phone", value: "+880 1700-000000" },
              { icon: MapPin, label: "Office", value: "City Hall, Dhaka" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border bg-card p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <p className="truncate text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to know about reporting and tracking city issues.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-xl border bg-card px-5 py-4 open:pb-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                  {question}
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Spot something that needs fixing?</h2>
          <p className="max-w-xl text-muted-foreground">
            Report it to your city and help make your neighborhood a better place.
          </p>
          <ReportIssueLink className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85">
            Report a new complaint
            <ArrowRight className="size-4" />
          </ReportIssueLink>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to home
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
