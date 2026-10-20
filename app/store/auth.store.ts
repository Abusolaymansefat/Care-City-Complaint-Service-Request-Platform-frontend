import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthPayload, User } from "@/types";
import { removeCookie, setCookie } from "@/lib/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: AuthPayload) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: ({ user, accessToken, refreshToken }) => {
        setCookie("accessToken", accessToken);
        setCookie("refreshToken", refreshToken);
        set({ user, accessToken, refreshToken });
      },
      setTokens: (accessToken, refreshToken) => {
        setCookie("accessToken", accessToken);
        if (refreshToken) setCookie("refreshToken", refreshToken);
        set({ accessToken, refreshToken: refreshToken ?? get().refreshToken });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        removeCookie("accessToken");
        removeCookie("refreshToken");
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    { name: "citycare-auth" }
  )
);