"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleAuth } from "@/hooks/useAuth";

export default function GoogleButton() {
  const { mutate } = useGoogleAuth();
  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(res) => res.credential && mutate(res.credential)}
        onError={() => toast.error("Google login failed")}
        theme="outline"
        size="large"
        text="continue_with"
        width="320"
      />
    </div>
  );
}