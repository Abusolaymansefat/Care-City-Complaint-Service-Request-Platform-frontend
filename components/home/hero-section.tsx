
"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.25),transparent_35%)]" />

      <div className="container relative mx-auto grid min-h-[650px] items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <ShieldCheck size={17} />
            Smart City Service Platform
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Build a Better City,
            <span className="block text-blue-400">
              Together.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-8 text-slate-300 md:text-lg">
            Report city problems, connect with local authorities,
            and track your complaints. Together, we can make
            our city cleaner, safer, and smarter.
          </p>

          <div className="flex flex-wrap gap-4">
            <LinkButton
              href="/register"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit a Complaint
              <ArrowRight className="ml-2" size={18} />
            </LinkButton>

            <LinkButton
              href="/tracking"
              size="lg"
              variant="outline"
              className="border-slate-600 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Search className="mr-2" size={18} />
              Track Complaint
            </LinkButton>
          </div>

          <div className="flex flex-wrap gap-6 pt-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Easy Reporting
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Real-time Tracking
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000"
              alt="Modern city skyline"
              className="h-[350px] w-full rounded-2xl object-cover md:h-[430px]"
            />

            <div className="absolute -bottom-5 left-0 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl md:-left-8">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <CheckCircle2 className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Complaint Resolved
                  </p>
                  <p className="text-xs text-slate-500">
                    City service update
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-8 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl md:-right-5">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} />
                <span className="text-sm font-semibold">
                  Smart City
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Connected Communities
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
