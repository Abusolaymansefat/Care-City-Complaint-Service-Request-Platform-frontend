"use client";

import { useState, type FormEvent } from "react";
import { Bot, FilePlus2, Lightbulb, Sparkles } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useComplaints";
import type { Category } from "@/types";

const aliases: Record<string, string[]> = {
  road: ["street", "pothole", "pavement", "sidewalk", "traffic", "road"],
  water: ["water", "pipe", "leak", "drain", "sewer", "flood", "drainage"],
  waste: ["waste", "garbage", "rubbish", "trash", "litter", "bin"],
  electric: ["electricity", "electric", "power", "streetlight", "light", "wire"],
  park: ["park", "tree", "playground", "garden"],
};

const wordsIn = (value: string) =>
  value.toLowerCase().match(/[a-z0-9]+/g) ?? [];

const suggestCategory = (issue: string, categories: Category[]) => {
  const issueWords = new Set(wordsIn(issue));
  const ranked = categories
    .map((category) => {
      const categoryText = `${category.name} ${category.department?.name ?? ""}`.toLowerCase();
      const categoryWords = new Set(wordsIn(categoryText));
      let score = [...issueWords].filter((word) => categoryWords.has(word)).length;

      for (const [family, terms] of Object.entries(aliases)) {
        if (
          terms.some((term) => issueWords.has(term)) &&
          (categoryText.includes(family) || categoryWords.has(family))
        ) {
          score += 2;
        }
      }

      return { category, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.category ?? null;
};

export default function CitizenAiGuidePage() {
  const { data, isLoading, isError } = useCategories({ limit: 100, isActive: true });
  const [issue, setIssue] = useState("");
  const [suggestion, setSuggestion] = useState<Category | null | undefined>(undefined);
  const [error, setError] = useState("");
  const categories = data?.data ?? [];

  const getGuidance = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!issue.trim()) {
      setError("Describe the issue first.");
      return;
    }

    setError("");
    setSuggestion(suggestCategory(issue, categories));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold">AI issue guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get a category suggestion and a checklist to help write a clear city service request.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4" aria-hidden="true" />
            Describe what happened
          </CardTitle>
          <CardDescription>
            Include the issue and where you noticed it. Do not include passwords or sensitive
            personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : isError ? (
            <p role="alert" className="text-sm text-destructive">
              Could not load categories for suggestions. Please refresh the page and try again.
            </p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active categories are available yet. You can still browse My complaints.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={getGuidance}>
              <div className="space-y-2">
                <Label htmlFor="issue-description">Issue description</Label>
                <Textarea
                  id="issue-description"
                  rows={5}
                  maxLength={1000}
                  placeholder="Example: A large pothole has formed near the bus stop on Central Road."
                  value={issue}
                  onChange={(event) => {
                    setIssue(event.target.value);
                    setSuggestion(undefined);
                    setError("");
                  }}
                />
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              </div>
              <Button type="submit">
                <Lightbulb aria-hidden="true" />
                Get guidance
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {suggestion !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {suggestion ? `Suggested category: ${suggestion.name}` : "Choose the closest category"}
            </CardTitle>
            <CardDescription>
              {suggestion?.description ??
                "The description did not clearly match a category. Review the available categories before submitting."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">To make your report easier to act on, include:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>The exact street, neighborhood, or nearby landmark</li>
                <li>When you first noticed the issue</li>
                <li>Any effect on residents or public safety</li>
              </ul>
            </div>
            <LinkButton href="/citizen/complaints/create-poster">
              <FilePlus2 aria-hidden="true" />
              Create a complaint
            </LinkButton>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Suggestions use simple keyword matching in your browser and are not an AI diagnosis or an
        official city decision. Review the suggested category before submitting.
      </p>
    </div>
  );
}
