"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/auth/form-field";
import { useResetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

function ResetPasswordForm() {
  const email = useSearchParams().get("email") ?? "";
  const { mutate, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: "" },
  });
  const otp = useWatch({ control, name: "otp" });

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-muted-foreground">Enter the code we emailed you and a new password</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="Email" type="email" {...register("email")} error={errors.email?.message} />

        <div className="space-y-2">
          <Label>Verification code</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(v) => setValue("otp", v, { shouldValidate: true })}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {errors.otp && <p className="text-center text-sm text-destructive">{errors.otp.message}</p>}
        </div>

        <FormField label="New Password" type="password" autoComplete="new-password" {...register("newPassword")} error={errors.newPassword?.message} />
        <FormField label="Confirm Password" type="password" autoComplete="new-password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />

        <Button type="submit" className="w-full" isDisabled={isPending}>
          {isPending ? "Updating..." : "Reset password"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">Back to login</Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}