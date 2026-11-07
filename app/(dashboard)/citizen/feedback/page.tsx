"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateFeedback, useMyComplaints } from "@/hooks/useComplaints";

const RATINGS = [1, 2, 3, 4, 5];

export default function CitizenFeedbackPage() {
  const { data, isLoading } = useMyComplaints({ limit: 100 });
  const createFeedback = useCreateFeedback();
  const [selected, setSelected] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const feedbackable = (data?.data ?? []).filter(
    (c) => c.status === "RESOLVED" || c.status === "CLOSED"
  );

  const submit = () => {
    if (!selected) return;
    createFeedback.mutate(
      { complaintId: selected, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setSelected("");
          setComment("");
          setRating(5);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your experience for resolved complaints.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-56 max-w-xl rounded-xl" />
      ) : !feedbackable.length ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Nothing to review yet</CardTitle>
            <CardDescription>
              Feedback can be submitted once a complaint is resolved or closed.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Submit feedback</CardTitle>
            <CardDescription>Rate the resolution of one of your complaints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complaint">Complaint</Label>
              <select
                id="complaint"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Select a complaint</option>
                {feedbackable.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.trackingCode} · {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {RATINGS.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={value === rating ? "default" : "outline"}
                    size="sm"
                    onPress={() => setRating(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                rows={4}
                placeholder="Tell us how it went"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Button
              isDisabled={!selected || createFeedback.isPending}
              onPress={submit}
            >
              {createFeedback.isPending ? "Submitting..." : "Submit feedback"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
