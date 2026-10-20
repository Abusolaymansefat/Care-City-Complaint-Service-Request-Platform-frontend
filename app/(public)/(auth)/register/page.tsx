"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/auth/form-field";
import GoogleButton from "@/components/auth/google-button";
import { useRegister } from "@/hooks/useAuth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">Report and track city issues</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="Full Name" autoComplete="name" {...register("name")} error={errors.name?.message} />
        <FormField label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <FormField label="Password" type="password" autoComplete="new-password" {...register("password")} error={errors.password?.message} />
        <FormField label="Confirm Password" type="password" autoComplete="new-password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
        <Button type="submit" className="w-full" isDisabled={isPending}>
          {isPending ? "Sending code..." : "Register"}
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
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  );
}