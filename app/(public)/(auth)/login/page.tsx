"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/auth/form-field";
import GoogleButton from "@/components/auth/google-button";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Login to your CityCare account</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <div className="space-y-2">
          <FormField label="Password" type="password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full" isDisabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">Register</Link>
      </p>
    </div>
  );
}