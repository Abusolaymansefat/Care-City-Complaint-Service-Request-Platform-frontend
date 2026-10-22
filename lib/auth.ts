import { isAxiosError } from "axios";
import type { Role, User } from "@/types";

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

export const getUserFromAccessToken = (accessToken: string): User => {
  const encodedPayload = accessToken.split(".")[1];
  if (!encodedPayload) throw new Error("Login response did not include a valid access token");

  try {
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    const role: Role | null =
      payload.role === "ADMIN"
        ? "ADMIN"
        : payload.role === "CITIZEN"
          ? "CITIZEN"
          : payload.role === "TECHNICIAN" || payload.role === "DEPARTMENT_OFFICER" || payload.role === "OFFICER"
            ? "OFFICER"
            : null;

    if (
      typeof payload.userId !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      !role
    ) {
      throw new Error("Login token did not include the required user details");
    }

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role,
      status: "ACTIVE",
      emailVerified: true,
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Login ")) throw error;
    throw new Error("Unable to read user details from the login token");
  }
};