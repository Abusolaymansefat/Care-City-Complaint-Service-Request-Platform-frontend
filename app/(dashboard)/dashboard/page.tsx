"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/store/auth.store";

const stats = [
  { label: "Total Complaints", value: "—" },
  { label: "Pending", value: "—" },
  { label: "In Progress", value: "—" },
  { label: "Resolved", value: "—" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const mounted = useMounted();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{mounted && user ? `, ${user.name}` : ""}
        </h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your complaints.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl">{s.value}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  );
}