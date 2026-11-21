"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/useMounted";
import { getDashboardPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardRedirect() {
  const router = useRouter();
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!mounted) return;
    router.replace(user ? getDashboardPath(user.role) : "/login");
  }, [mounted, router, user]);

  return (
    <div className="space-y-4" aria-busy="true" aria-label="Opening dashboard">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
