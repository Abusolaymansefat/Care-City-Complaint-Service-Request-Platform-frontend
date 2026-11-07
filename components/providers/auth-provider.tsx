"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getApiError } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!accessToken) return;

    let active = true;
    api
      .get<{ data: User }>("/auth/me")
      .then(({ data }) => {
        if (active && useAuthStore.getState().accessToken === accessToken) {
          setUser(data.data);
        }
      })
      .catch((error: unknown) => {
        if (active && useAuthStore.getState().accessToken === accessToken) {
          toast.error(`Couldn't refresh your profile: ${getApiError(error)}`);
        }
      });

    return () => {
      active = false;
    };
  }, [accessToken, setUser]);

  return <>{children}</>;
}