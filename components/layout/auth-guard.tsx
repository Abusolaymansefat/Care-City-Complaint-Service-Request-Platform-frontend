"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/useMounted";
import { getDashboardPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types";

export default function AuthGuard({
  roles,
  children,
}: {
  roles?: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const allowed = !!user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (!mounted) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace(getDashboardPath(user.role));
  }, [mounted, user, allowed, router]);

  if (!mounted || !allowed) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  return <>{children}</>;
}