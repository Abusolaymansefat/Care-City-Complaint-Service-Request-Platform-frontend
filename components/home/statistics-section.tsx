
"use client";

import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Clock,
  Building2,
} from "lucide-react";

const statistics = [
  {
    title: "Total Complaints",
    value: "12,500+",
    description: "Complaints submitted",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Resolved Complaints",
    value: "9,850+",
    description: "Successfully resolved",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Pending Complaints",
    value: "2,650+",
    description: "Currently processing",
    icon: Clock,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Departments",
    value: "25+",
    description: "Active departments",
    icon: Building2,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="font-semibold text-blue-600">
            OUR IMPACT
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            CityCare at a Glance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            See how our platform helps citizens and local
            authorities improve city services.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </h3>

                <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
