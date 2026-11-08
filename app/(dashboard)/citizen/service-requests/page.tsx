"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useComplaints";

export default function CitizenServiceRequestsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useCategories({ limit: 100, isActive: true });
  const categories = (data?.data ?? []).filter((category) => {
    const term = search.trim().toLowerCase();
    return !term ||
      category.name.toLowerCase().includes(term) ||
      category.description?.toLowerCase().includes(term) ||
      category.department?.name.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">City service requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a service category to start a request with the right city department.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Search city services"
          className="pl-9"
          placeholder="Search services or departments"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-40 rounded-xl" />)}
        </div>
      ) : isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load city services</CardTitle>
            <CardDescription>Please refresh the page and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !categories.length ? (
        <Card>
          <CardHeader className="items-center text-center">
            <Wrench className="mb-2 size-8 text-muted-foreground" aria-hidden="true" />
            <CardTitle>{search ? "No matching services" : "No active services"}</CardTitle>
            <CardDescription>
              {search
                ? "Try another service or department name."
                : "Available city service categories will appear here."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/citizen/complaints/create-poster?categoryId=${encodeURIComponent(category.id)}`}
              className="group"
            >
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <CardDescription>
                    {category.description ?? "Submit a request for this city service."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {category.department?.name ?? "City services"} · {category.slaHours}h response target
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
