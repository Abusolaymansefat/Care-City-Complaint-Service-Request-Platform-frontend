import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface DashboardChartItem {
  label: string;
  value: number;
}

const barColors = [
  "bg-blue-600",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
];

export function DashboardBarChart({
  title,
  description,
  items,
  isLoading,
  isError,
}: {
  title: string;
  description: string;
  items: DashboardChartItem[];
  isLoading: boolean;
  isError: boolean;
}) {
  const maxValue = Math.max(0, ...items.map(({ value }) => value));

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => <Skeleton key={item} className="h-8 w-full" />)}
          </div>
        ) : isError ? (
          <p role="alert" className="text-sm text-destructive">
            Chart data could not be loaded.
          </p>
        ) : !items.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No activity to show yet.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map(({ label, value }, index) => {
              const chartValue = Number.isFinite(value) ? Math.max(0, value) : 0;
              const width = maxValue ? (chartValue / maxValue) * 100 : 0;

              return (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-muted-foreground">{label}</span>
                    <span className="font-medium tabular-nums">{chartValue.toLocaleString()}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={label}
                    aria-valuemin={0}
                    aria-valuemax={maxValue || 1}
                    aria-valuenow={chartValue}
                    className="h-2.5 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={`h-full rounded-full transition-[width] ${barColors[index % barColors.length]}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
