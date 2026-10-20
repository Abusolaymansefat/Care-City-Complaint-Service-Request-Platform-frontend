"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyEmail } from "@/hooks/useAuth";

function VerifyEmailForm() {
  const email = useSearchParams().get("email") ?? "";
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useVerifyEmail();

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>. It expires in 5 minutes.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({ email, otp });
        }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" className="w-full" isDisabled={isPending || otp.length !== 6 || !email}>
          {isPending ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Code expired?{" "}
        <Link href="/register" className="text-primary hover:underline">Register again</Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}