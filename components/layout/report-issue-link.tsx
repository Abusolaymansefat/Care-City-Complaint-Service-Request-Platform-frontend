"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

export default function ReportIssueLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { user } = useAuthStore();
  const mounted = useMounted();
  const href = !mounted
    ? "/register"
    : user?.role === "CITIZEN"
      ? "/citizen/complaints/create-poster"
      : user
        ? "/dashboard"
        : "/register";

  return (
    <Link href={href} className={cn(className)}>
      {children}
    </Link>
  );
}
