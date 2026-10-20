"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { accessToken, setUser } = useAuthStore.getState();
    if (!accessToken) return;
    api.get<{ data: User }>("/auth/me").then((r) => setUser(r.data.data)).catch(() => {});
  }, []);

  return <>{children}</>;
}