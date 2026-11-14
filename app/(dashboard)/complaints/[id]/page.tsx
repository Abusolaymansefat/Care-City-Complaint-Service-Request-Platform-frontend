"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";

export default function ComplaintNotificationRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (!role) return;

    const complaintId = encodeURIComponent(id);
    const destination =
      role === "CITIZEN"
        ? `/citizen/complaints/${complaintId}`
        : role === "DEPARTMENT_OFFICER"
          ? `/officer/complaints/${complaintId}`
          : `/complaint/${complaintId}`;

    router.replace(destination);
  }, [id, role, router]);

  return <Skeleton className="h-64 w-full" />;
}
