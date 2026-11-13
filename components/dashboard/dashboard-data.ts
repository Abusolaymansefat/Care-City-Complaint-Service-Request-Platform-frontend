import { format, startOfDay, subDays } from "date-fns";

export const DASHBOARD_RECORD_LIMIT = 30;

export interface DashboardCount {
  label: string;
  value: number;
}

export interface DashboardDailyCount extends DashboardCount {
  date: string;
}

export function buildDailyCounts<T>(
  records: readonly T[],
  getDate: (record: T) => string | Date,
  days = 14,
): DashboardDailyCount[] {
  const today = startOfDay(new Date());
  const firstDay = subDays(today, days - 1);
  const counts = new Map<string, number>();

  records.forEach((record) => {
    const rawDate = getDate(record);
    const date = startOfDay(rawDate instanceof Date ? rawDate : new Date(rawDate));
    if (Number.isNaN(date.getTime()) || date < firstDay || date > today) return;

    const key = format(date, "yyyy-MM-dd");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = subDays(today, days - index - 1);
    const key = format(date, "yyyy-MM-dd");

    return {
      date: key,
      label: format(date, "dd MMM"),
      value: counts.get(key) ?? 0,
    };
  });
}

export function buildTopCounts<T>(
  records: readonly T[],
  getLabel: (record: T) => string | null | undefined,
  limit = 5,
): DashboardCount[] {
  const counts = new Map<string, number>();

  records.forEach((record) => {
    const label = getLabel(record)?.trim() || "Uncategorized";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts, ([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value || left.label.localeCompare(right.label))
    .slice(0, limit);
}
