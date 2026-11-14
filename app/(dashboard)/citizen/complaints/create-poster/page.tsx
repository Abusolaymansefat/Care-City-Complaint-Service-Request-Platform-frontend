"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, FilePlus2, ImagePlus, MapPin, Video, X } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useCreateComplaint } from "@/hooks/useComplaints";
import {
  complaintImageLimit,
  complaintImageSizeLimit,
  complaintImageTypes,
  complaintVideoLimit,
  complaintVideoSizeLimit,
  complaintVideoTypes,
  createComplaintSchema,
  type CreateComplaintFormValues,
} from "@/lib/validations/complaint";

const LocationPicker = dynamic(() => import("@/components/complaints/location-picker"), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full rounded-xl" />,
});

export default function CreatePosterPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useCategories({ limit: 100, isActive: true });
  const createComplaint = useCreateComplaint();
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateComplaintFormValues>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      categoryId: "",
      images: [],
      videos: [],
    },
  });
  const description = useWatch({ control, name: "description" }) ?? "";
  const images = useWatch({ control, name: "images" }) ?? [];
  const videos = useWatch({ control, name: "videos" }) ?? [];
  const latitude = useWatch({ control, name: "latitude" }) ?? null;
  const longitude = useWatch({ control, name: "longitude" }) ?? null;
  const categories = useMemo(() => data?.data ?? [], [data?.data]);

  useEffect(() => {
    const categoryId = new URLSearchParams(window.location.search).get("categoryId");
    if (categoryId && categories.some((category) => category.id === categoryId)) {
      setValue("categoryId", categoryId, { shouldValidate: true });
    }
  }, [categories, setValue]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Your browser does not support location access. Select a point on the map.");
      return;
    }

    setLocationMessage("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setValue("latitude", coords.latitude, { shouldValidate: true });
        setValue("longitude", coords.longitude, { shouldValidate: true });
        setLocationMessage("Current location selected. Click the map to adjust it.");
      },
      () => setLocationMessage("Location access was unavailable. Select a point on the map instead."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const setMapLocation = (nextLatitude: number, nextLongitude: number) => {
    setValue("latitude", nextLatitude, { shouldValidate: true });
    setValue("longitude", nextLongitude, { shouldValidate: true });
    setLocationMessage("Map location selected.");
  };

  const submitComplaint = (values: CreateComplaintFormValues) =>
    createComplaint.mutate(values, {
      onSuccess: (complaint) => {
        router.push(`/citizen/complaints/${complaint.id}`);
      },
    });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <LinkButton
          href="/citizen/complaints"
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
        >
          <ArrowLeft aria-hidden="true" />
          My complaints
        </LinkButton>
        <h1 className="text-2xl font-semibold">Create a complaint</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the issue and where it is happening so the right city team can help.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FilePlus2 className="size-4" aria-hidden="true" />
            Complaint details
          </CardTitle>
          <CardDescription>Fields marked required must be completed.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p role="alert" className="text-sm text-destructive">
              Could not load service categories. Please refresh the page and try again.
            </p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              There are no active service categories yet. Please try again later.
            </p>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit(submitComplaint)}>
              <div className="space-y-2">
                <Label htmlFor="complaint-title">Issue title</Label>
                <Input
                  id="complaint-title"
                  maxLength={150}
                  placeholder="For example: Streetlight not working"
                  aria-invalid={Boolean(errors.title)}
                  {...register("title")}
                />
                {errors.title && <p role="alert" className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-description">Description</Label>
                <Textarea
                  id="complaint-description"
                  maxLength={3000}
                  rows={5}
                  placeholder="Explain what happened, when you noticed it, and how it affects the area."
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/3000 characters
                </p>
                {errors.description && <p role="alert" className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-address">Location or address</Label>
                <Input
                  id="complaint-address"
                  maxLength={300}
                  placeholder="Street, neighborhood, or a nearby landmark"
                  aria-invalid={Boolean(errors.address)}
                  {...register("address")}
                />
                {errors.address && <p role="alert" className="text-sm text-destructive">{errors.address.message}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Label>Pin the issue on the map</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose a map point or use your current location. The address above is still required.
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onPress={useCurrentLocation}>
                    <MapPin aria-hidden="true" />
                    Use my location
                  </Button>
                </div>
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onSelect={setMapLocation}
                />
                {locationMessage && <p className="text-xs text-muted-foreground">{locationMessage}</p>}
                {latitude !== null && longitude !== null && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-category">Service category</Label>
                <select
                  id="complaint-category"
                  aria-invalid={Boolean(errors.categoryId)}
                  aria-required="true"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...register("categoryId")}
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p role="alert" className="text-sm text-destructive">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-images">Issue photos (optional)</Label>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <input
                      ref={(element) => {
                        field.ref(element);
                        imageInput.current = element;
                      }}
                      id="complaint-images"
                      type="file"
                      accept={complaintImageTypes.join(",")}
                      multiple
                      className="block w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                      onChange={(event) => {
                        field.onChange([
                          ...field.value,
                          ...Array.from(event.currentTarget.files ?? []),
                        ]);
                        event.currentTarget.value = "";
                      }}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Up to {complaintImageLimit} JPEG, PNG, or WebP images, {complaintImageSizeLimit / 1024 / 1024} MB each.
                </p>
                {errors.images?.message && (
                  <p role="alert" className="text-sm text-destructive">{errors.images.message}</p>
                )}
                {images.length > 0 && (
                  <ul className="space-y-2">
                    {images.map((image, index) => (
                      <li
                        key={`${image.name}-${image.lastModified}`}
                        className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <ImagePlus className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span className="truncate">{image.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {(image.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${image.name}`}
                          onPress={() => {
                            setValue(
                              "images",
                              images.filter((_, imageIndex) => imageIndex !== index),
                              { shouldValidate: true }
                            );
                            if (imageInput.current) imageInput.current.value = "";
                          }}
                        >
                          <X aria-hidden="true" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-videos">Issue videos (optional)</Label>
                <Controller
                  name="videos"
                  control={control}
                  render={({ field }) => (
                    <input
                      ref={(element) => {
                        field.ref(element);
                        videoInput.current = element;
                      }}
                      id="complaint-videos"
                      type="file"
                      accept={complaintVideoTypes.join(",")}
                      multiple
                      className="block w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                      onChange={(event) => {
                        field.onChange([
                          ...field.value,
                          ...Array.from(event.currentTarget.files ?? []),
                        ]);
                        event.currentTarget.value = "";
                      }}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Up to {complaintVideoLimit} MP4, WebM, or QuickTime videos, {complaintVideoSizeLimit / 1024 / 1024} MB each.
                </p>
                {errors.videos?.message && (
                  <p role="alert" className="text-sm text-destructive">{errors.videos.message}</p>
                )}
                {videos.length > 0 && (
                  <ul className="space-y-2">
                    {videos.map((video, index) => (
                      <li
                        key={`${video.name}-${video.lastModified}`}
                        className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Video className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span className="truncate">{video.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {(video.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${video.name}`}
                          onPress={() => {
                            setValue(
                              "videos",
                              videos.filter((_, videoIndex) => videoIndex !== index),
                              { shouldValidate: true }
                            );
                            if (videoInput.current) videoInput.current.value = "";
                          }}
                        >
                          <X aria-hidden="true" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" isDisabled={createComplaint.isPending}>
                  {createComplaint.isPending ? "Submitting..." : "Submit complaint"}
                </Button>
                <LinkButton href="/citizen/complaints" variant="outline">
                  Cancel
                </LinkButton>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
