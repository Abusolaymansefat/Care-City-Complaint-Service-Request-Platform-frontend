"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;
    const hasCookie = document.cookie.split("; ").some((c) => c.startsWith("token="));
    if (!hasCookie) {
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    localStorage.setItem("token", token);
  }, [token]);

  return <>{children}</>;
}