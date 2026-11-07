import { Skeleton } from "@/components/ui/skeleton";

export default function AuthPageLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading form"
      className="mx-auto w-full max-w-md space-y-6 p-6"
    >
      <span className="sr-only">Loading form...</span>
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-40" />
        <Skeleton className="mx-auto h-4 w-56" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}