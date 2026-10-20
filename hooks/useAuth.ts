"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getApiError, getDashboardPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import type { AuthPayload } from "@/types";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "@/lib/validations/auth";

const post = async <T>(url: string, body: unknown) =>
  (await api.post<{ data: T }>(url, body)).data.data;

const useAuthSuccess = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  return (data: AuthPayload, message: string) => {
    setAuth(data);
    toast.success(message);
    router.push(getDashboardPath(data.user.role));
  };
};

export const useLogin = () => {
  const onAuth = useAuthSuccess();
  return useMutation({
    mutationFn: (input: LoginInput) => post<AuthPayload>("/auth/login", input),
    onSuccess: (data) => onAuth(data, "Welcome back!"),
    onError: (e) => toast.error(getApiError(e)),
  });
};

export const useGoogleAuth = () => {
  const onAuth = useAuthSuccess();
  return useMutation({
    mutationFn: (idToken: string) => post<AuthPayload>("/auth/google-login", { idToken }),
    onSuccess: (data) => onAuth(data, "Logged in with Google"),
    onError: (e) => toast.error(getApiError(e)),
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ confirmPassword, ...input }: RegisterInput) => post("/auth/register", input),
    onSuccess: (_, vars) => {
      toast.success("Verification code sent to your email");
      router.push(`/verify-email?email=${encodeURIComponent(vars.email)}`);
    },
    onError: (e) => toast.error(getApiError(e)),
  });
};

export const useVerifyEmail = () => {
  const onAuth = useAuthSuccess();
  return useMutation({
    mutationFn: (input: VerifyEmailInput) => post<AuthPayload>("/auth/verify-email", input),
    onSuccess: (data) => onAuth(data, "Email verified. Welcome to CityCare!"),
    onError: (e) => toast.error(getApiError(e)),
  });
};

export const useForgotPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => post("/auth/forgot-password", input),
    onSuccess: (_, vars) => {
      toast.success("Reset code sent to your email");
      router.push(`/reset-password?email=${encodeURIComponent(vars.email)}`);
    },
    onError: (e) => toast.error(getApiError(e)),
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ confirmPassword, ...input }: ResetPasswordInput) =>
      post("/auth/reset-password", input),
    onSuccess: () => {
      toast.success("Password updated. Please login.");
      router.push("/login");
    },
    onError: (e) => toast.error(getApiError(e)),
  });
};

export const useLogout = () => {
  const router = useRouter();
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    qc.clear();
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };
};