import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardDailyCount } from "./dashboard-data";

const chartWidth = 840;
const chartHeight = 250;
const chartLeft = 44;
const chartRight = 16;
const chartTop = 16;
const chartBottom = 42;

export function DashboardTrendChart({
  title,
  description,
  data,
  isLoading,
  isError,
}: {
  title: string;
  description: string;
  data: DashboardDailyCount[];
  isLoading: boolean;
  isError: boolean;
}) {
  const values = data.map(({ value }) => Math.max(0, value));
  const maxValue = Math.max(1, ...values);
  const plotWidth = chartWidth - chartLeft - chartRight;
  const plotHeight = chartHeight - chartTop - chartBottom;
  const points = values.map((value, index) => {
    const x = chartLeft + (data.length <= 1 ? 0 : (index / (data.length - 1)) * plotWidth);
    const y = chartTop + plotHeight - (value / maxValue) * plotHeight;
    return { x, y, value, label: data[index]?.label ?? "" };
  });
  const line = points.map(({ x, y }, index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
  const hasActivity = values.some((value) => value > 0);

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-card dark:ring-border">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : isError ? (
          <p role="alert" className="py-16 text-center text-sm text-destructive">
            Chart data could not be loaded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <svg
              role="img"
              aria-label={`${title}: ${values.reduce((sum, value) => sum + value, 0)} records over the last ${data.length} days`}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-64 min-w-[560px] w-full"
            >
              {[0, 0.5, 1].map((fraction) => {
                const y = chartTop + plotHeight - fraction * plotHeight;
                const tick = Math.round(maxValue * fraction);
                return (
                  <g key={fraction}>
                    <line
                      x1={chartLeft}
                      x2={chartWidth - chartRight}
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeDasharray="4 5"
                    />
                    <text
                      x={chartLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-400 text-[11px] dark:fill-slate-500"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}
              {hasActivity && (
                <path
                  d={line}
                  fill="none"
                  stroke="#1264d8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {points.map(({ x, y, value, label }, index) => (
                <g key={data[index]?.date ?? label}>
                  {hasActivity && value > 0 && (
                    <circle cx={x} cy={y} r="4" fill="#1264d8" stroke="white" strokeWidth="2">
                      <title>{`${label}: ${value}`}</title>
                    </circle>
                  )}
                  {index % 2 === 0 || index === points.length - 1 ? (
                    <text
                      x={x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] dark:fill-slate-500"
                    >
                      {label}
                    </text>
                  ) : null}
                </g>
              ))}
            </svg>
          </div>
        )}
        {!isLoading && !isError && !hasActivity && (
          <p className="-mt-2 text-center text-xs text-muted-foreground">
            No activity recorded in this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
