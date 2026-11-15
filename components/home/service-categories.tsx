
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Construction,
  Droplets,
  Lightbulb,
  Trash2,
  Waves,
  Bus,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    title: "Road & Infrastructure",
    description: "Report damaged roads, broken footpaths and infrastructure problems.",
    icon: Construction,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Water Supply",
    description: "Report water shortages, pipeline leaks and water quality issues.",
    icon: Droplets,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Electricity",
    description: "Report power supply problems and electrical service issues.",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Waste Management",
    description: "Report overflowing garbage bins and waste collection problems.",
    icon: Trash2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Drainage System",
    description: "Report blocked drains and waterlogging in your area.",
    icon: Waves,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Public Transport",
    description: "Report public transport and traffic-related service issues.",
    icon: Bus,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function ServiceCategories() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-blue-600">
              OUR SERVICES
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              What Can We Help You With?
            </h2>
            <p className="mt-4 max-w-xl text-slate-500">
              Choose a service category and report problems
              in your community.
            </p>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            View All Services
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href="/citizen/complaints/create"
                  className="group block h-full rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${category.color}`}>
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 dark:text-white">
                    {category.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Report a Problem
                    <ArrowUpRight
                      size={17}
                      className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
