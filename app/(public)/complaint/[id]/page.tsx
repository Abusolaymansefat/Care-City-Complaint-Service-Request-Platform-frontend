"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, MapPin } from "lucide-react";
import { ComplaintStatusBadge, PriorityBadge } from "@/components/citizen/complaints/complaint-status-badge";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicComplaint } from "@/hooks/useComplaints";

export default function PublicComplaintDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: complaint, isLoading, isError } = usePublicComplaint(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6">
        <Skeleton className="aspect-[16/8] w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <>
        <Card className="mx-auto my-10 max-w-2xl" role="alert">
          <CardHeader>
            <CardTitle>Complaint not found</CardTitle>
            <CardDescription>This public complaint is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft aria-hidden="true" />
                Back to home
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>

        <Card className="overflow-hidden">
          <div className="relative aspect-[16/8] bg-muted">
            <Image
              src={complaint.imageUrls[0] ?? "/error-page-not.webp"}
              alt={complaint.imageUrls.length ? complaint.title : "No complaint photo"}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              unoptimized
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl sm:text-2xl">{complaint.title}</CardTitle>
                <CardDescription className="mt-1">
                  {complaint.trackingCode} · {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <PriorityBadge priority={complaint.priority} />
                <ComplaintStatusBadge status={complaint.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-line leading-7 text-muted-foreground">
              {complaint.description}
            </p>
            <div className="flex items-start gap-2 border-t pt-4 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{complaint.address}</span>
            </div>
            {complaint.category && (
              <p className="text-sm text-muted-foreground">
                Service category: {complaint.category.name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manage your complaint</CardTitle>
            <CardDescription>
              Citizens can manage their own reports and complete required bKash payments from
              their complaint details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/citizen/complaints">
              <Button variant="outline">Open my complaints</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
