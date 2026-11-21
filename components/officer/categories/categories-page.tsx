
"use client";

import { useMemo, useState } from "react";
import { Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Replace this sample data with your useCategories() hook.
const categories = [
  {
    id: "1",
    name: "Road & Transportation",
    description: "Road damage, traffic and transportation issues",
    slaHours: 72,
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Water Supply",
    description: "Water supply and drainage complaints",
    slaHours: 48,
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Electricity",
    description: "Street lights and electricity-related issues",
    slaHours: 24,
    status: "ACTIVE",
  },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase();

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Department Categories</h1>
        <p className="text-sm text-muted-foreground">
          View complaint categories and their service-level targets.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No categories found</p>
            <p className="text-sm text-muted-foreground">
              Try another search keyword.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold">{category.name}</h2>
                  <Badge variant="secondary">{category.status}</Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>

                <div className="border-t pt-3 text-sm">
                  <span className="text-muted-foreground">SLA target: </span>
                  <span className="font-semibold">
                    {category.slaHours} hours
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
