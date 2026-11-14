"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { PriorityBadge } from "@/components/citizen/complaints/complaint-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicComplaints } from "@/hooks/useComplaints";

export default function PublicComplaintsGrid() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePublicComplaints({ page, limit: 6 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Community reports
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Recent city complaints
        </h2>
        <p className="mt-4 text-muted-foreground">
          Browse reports from across the city. Select a photo or title to view its details.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="mx-auto mt-10 max-w-2xl" role="alert">
          <CardHeader>
            <CardTitle>Could not load community reports</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !data?.data.length ? (
        <Card className="mx-auto mt-10 max-w-2xl">
          <CardHeader>
            <CardTitle>No complaints to show yet</CardTitle>
            <CardDescription>New public reports will appear here.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((complaint) => (
              <Card key={complaint.id} className="overflow-hidden">
                <Link
                  href={`/complaint/${complaint.id}`}
                  aria-label={`View details for ${complaint.title}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-muted"
                >
                  <Image
                    src={complaint.imageUrls[0] ?? "/error-page-not.webp"}
                    alt={complaint.imageUrls.length ? complaint.title : "No complaint photo"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-base">
                      <Link
                        href={`/complaint/${complaint.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {complaint.title}
                      </Link>
                    </CardTitle>
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                  <CardDescription>{complaint.trackingCode}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  <span className="line-clamp-2">{complaint.address}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.meta && data.meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                isDisabled={page <= 1 || isLoading}
                onPress={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                isDisabled={page >= data.meta.totalPages || isLoading}
                onPress={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
