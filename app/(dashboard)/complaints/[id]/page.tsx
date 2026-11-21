"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

export default function ComplaintNotificationRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!mounted || !user) return;

    const destination =
      user.role === "ADMIN"
        ? `/complaint/${id}`
        : user.role === "DEPARTMENT_OFFICER"
          ? `/officer/complaints/${id}`
          : user.role === "TECHNICIAN"
            ? "/technician/assignments"
            : `/citizen/complaints/${id}`;

    router.replace(destination);
  }, [id, mounted, router, user]);

  return (
    <div className="space-y-4" aria-busy="true" aria-label="Opening complaint">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
