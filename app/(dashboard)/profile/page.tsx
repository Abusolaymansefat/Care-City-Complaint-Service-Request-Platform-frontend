"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { BadgeCheck, Building2, Camera, LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/useMounted";
import { api } from "@/lib/api";
import { getApiError, getInitials } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

const formatRole = (role: string) =>
  role
    .trim()
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function ProfilePage() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const imageInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!mounted || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile images must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);
    setUploading(true);

    try {
      const response = await api.patch<{ data: User }>("/user/upload-profile-image", formData);
      setUser({ ...user, ...response.data.data });
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setUploading(false);
    }
  };

  const details = [
    { label: "Full name", value: user.name, icon: UserRound },
    { label: "Email address", value: user.email, icon: Mail },
    { label: "Account role", value: formatRole(user.role), icon: ShieldCheck },
    { label: "Department", value: user.department?.name ?? "Not assigned", icon: Building2 },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View the account information connected to your CityCare profile.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <Avatar className="size-16">
              <AvatarImage src={user.imageUrl ?? undefined} alt={`${user.name}'s profile`} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Choose a profile photo"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              isDisabled={uploading}
              onPress={() => imageInput.current?.click()}
            >
              {uploading ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Camera aria-hidden="true" />
              )}
              {uploading ? "Uploading..." : "Change photo"}
            </Button>
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-xl">{user.name}</CardTitle>
            <CardDescription className="mt-1 truncate">{user.email}</CardDescription>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
            {user.status.toLowerCase()}
          </span>
        </CardHeader>
        <CardContent className="grid gap-5 pt-2 sm:grid-cols-2">
          {details.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex min-w-0 items-start gap-3 rounded-lg border p-4">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BadgeCheck className="size-4" aria-hidden="true" />
            Email verification
          </CardTitle>
          <CardDescription>
            {user.emailVerified
              ? "Your email address has been verified."
              : "Your email address is not verified yet."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
