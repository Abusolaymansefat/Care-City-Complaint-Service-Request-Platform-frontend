
"use client";

import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Replace these placeholder values with department-scoped API statistics.
const reportStats = [
  {
    title: "Total Complaints",
    value: "248",
    description: "Complaints in your department",
    icon: FileText,
  },
  {
    title: "In Progress",
    value: "42",
    description: "Currently being processed",
    icon: Clock,
  },
  {
    title: "Resolved",
    value: "186",
    description: "Successfully resolved",
    icon: CheckCircle2,
  },
  {
    title: "Overdue",
    value: "20",
    description: "Past their SLA deadline",
    icon: AlertCircle,
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Department Reports</h1>
        <p className="text-sm text-muted-foreground">
          Monitor complaint performance and department service delivery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Reports chart</p>
              <p className="text-sm text-muted-foreground">
                Connect your complaint analytics API to display charts here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
