"use client";

import { useTheme } from "next-themes";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/useMounted";

const themeOptions = [
  { value: "light", label: "Light", description: "Use a bright appearance.", icon: Sun },
  { value: "dark", label: "Dark", description: "Use a darker appearance.", icon: Moon },
  { value: "system", label: "System", description: "Match your device preference.", icon: Laptop },
] as const;

export default function SettingsPage() {
  const mounted = useMounted();
  const { setTheme, theme } = useTheme();

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize how CityCare looks and manage your account security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how CityCare is displayed on this device.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map(({ value, label, description, icon: Icon }) => {
            const selected = theme === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setTheme(value)}
                className="flex min-h-32 flex-col items-start rounded-xl border p-4 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-primary aria-pressed:bg-primary/5"
              >
                <span className="flex w-full items-center justify-between">
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  {selected && <Check className="size-4 text-primary" aria-label="Selected" />}
                </span>
                <span className="mt-4 text-sm font-medium">{label}</span>
                <span className="mt-1 text-xs text-muted-foreground">{description}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account security</CardTitle>
          <CardDescription>
            Request a password reset using the email address on your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LinkButton href="/forgot-password" variant="outline">
            Reset password
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
