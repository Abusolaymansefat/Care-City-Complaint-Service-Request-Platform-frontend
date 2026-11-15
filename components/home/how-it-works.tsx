
"use client";

import { motion } from "framer-motion";
import {
  FilePlus2,
  ClipboardList,
  SearchCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Submit a Complaint",
    description:
      "Create an account and submit your city service complaint with details, location and photos.",
    icon: FilePlus2,
  },
  {
    number: "02",
    title: "Review & Assignment",
    description:
      "The responsible department reviews your complaint and assigns it to the appropriate technician.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Track Progress",
    description:
      "Use your unique tracking code to follow complaint progress and receive updates.",
    icon: SearchCheck,
  },
  {
    number: "04",
    title: "Get Resolution",
    description:
      "The assigned team works on the issue and updates the complaint when it is resolved.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="font-semibold text-blue-600">
            SIMPLE PROCESS
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            How CityCare Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Reporting city problems has never been easier.
            Follow four simple steps to make a difference.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                  <Icon size={35} />

                  <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>

                {index !== steps.length - 1 && (
                  <ArrowRight
                    className="absolute -right-7 top-8 hidden text-blue-300 lg:block"
                    size={25}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
