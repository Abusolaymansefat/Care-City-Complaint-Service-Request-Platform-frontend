import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}