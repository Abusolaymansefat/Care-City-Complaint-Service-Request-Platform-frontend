import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const toneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-950/50 dark:text-cyan-300 dark:ring-cyan-900",
  amber: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
} as const;

export function DashboardMetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "blue",
  isLoading,
  isError,
}: {
  label: string;
  value: number | string | undefined;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof toneClasses;
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <CardDescription className="font-medium text-slate-500 dark:text-muted-foreground">
            {label}
          </CardDescription>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
              {isError ? "—" : (value ?? 0).toLocaleString()}
            </CardTitle>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${toneClasses[tone]}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
    </Card>
  );
}
