import { isAxiosError } from "axios";
import type { Role } from "@/types";

export const getDashboardPath = (role: Role) => (role === "ADMIN" ? "/admin" : "/dashboard");

export const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export const setCookie = (name: string, value: string, days = 7) => {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 86400}; SameSite=Lax`;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

export const getApiError = (err: unknown) =>
  isAxiosError(err) ? (err.response?.data?.message ?? err.message) : "Something went wrong";