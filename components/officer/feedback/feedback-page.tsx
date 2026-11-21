
"use client";

import { useMemo, useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Replace this sample data with your useFeedback() hook.
const feedbacks = [
  {
    id: "1",
    citizen: "Rahim Ahmed",
    complaint: "Road damage near main road",
    rating: 5,
    comment: "The issue was resolved quickly. Thank you.",
    status: "VISIBLE",
  },
  {
    id: "2",
    citizen: "Karim Hasan",
    complaint: "Water supply problem",
    rating: 4,
    comment: "Good service, but it took some time.",
    status: "VISIBLE",
  },
  {
    id: "3",
    citizen: "Nusrat Jahan",
    complaint: "Street light issue",
    rating: 3,
    comment: "The service was average.",
    status: "HIDDEN",
  },
];

export default function FeedbackPage() {
  const [search, setSearch] = useState("");

  const filteredFeedback = useMemo(() => {
    const query = search.toLowerCase();

    return feedbacks.filter(
      (item) =>
        item.citizen.toLowerCase().includes(query) ||
        item.complaint.toLowerCase().includes(query) ||
        item.comment.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Citizen Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Review feedback submitted by citizens for your department.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feedback..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      {filteredFeedback.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No feedback found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredFeedback.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{item.citizen}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.complaint}
                    </p>
                  </div>
                  <Badge
                    variant={item.status === "VISIBLE" ? "secondary" : "outline"}
                  >
                    {item.status}
                  </Badge>
                </div>

                <div className="text-sm">
                  <span className="font-semibold">Rating: </span>
                  <span>{item.rating}/5</span>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  “{item.comment}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
