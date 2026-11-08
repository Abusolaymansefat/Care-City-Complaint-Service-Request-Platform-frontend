import { z } from "zod";

const complaintImageSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  "Choose a valid media file."
);

export const complaintImageLimit = 5;
export const complaintImageSizeLimit = 5 * 1024 * 1024;
export const complaintVideoLimit = 2;
export const complaintVideoSizeLimit = 20 * 1024 * 1024;
export const complaintImageTypes = ["image/jpeg", "image/png", "image/webp"];
export const complaintVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

export const createComplaintSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(150),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(3000),
  address: z.string().trim().min(5, "Location must be at least 5 characters.").max(300),
  categoryId: z.string().uuid("Choose a service category."),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z
    .array(complaintImageSchema)
    .max(complaintImageLimit, `Choose no more than ${complaintImageLimit} images.`)
    .superRefine((files, context) => {
      files.forEach((file) => {
        if (!complaintImageTypes.includes(file.type)) {
          context.addIssue({
            code: "custom",
            message: `${file.name} must be a JPEG, PNG, or WebP image.`,
          });
        }

        if (file.size > complaintImageSizeLimit) {
          context.addIssue({
            code: "custom",
            message: `${file.name} must be 5 MB or smaller.`,
          });
        }
      });
    }),
  videos: z
    .array(complaintImageSchema)
    .max(complaintVideoLimit, `Choose no more than ${complaintVideoLimit} videos.`)
    .superRefine((files, context) => {
      files.forEach((file) => {
        if (!complaintVideoTypes.includes(file.type)) {
          context.addIssue({
            code: "custom",
            message: `${file.name} must be an MP4, WebM, or QuickTime video.`,
          });
        }

        if (file.size > complaintVideoSizeLimit) {
          context.addIssue({
            code: "custom",
            message: `${file.name} must be 20 MB or smaller.`,
          });
        }
      });
    }),
}).refine(
  (values) => (values.latitude === undefined) === (values.longitude === undefined),
  { path: ["latitude"], message: "Choose a valid map location." }
);

export const trackingCodeSchema = z.object({
  trackingCode: z.string().trim().min(1, "Enter a tracking code.").max(100),
});

export type CreateComplaintFormValues = z.infer<typeof createComplaintSchema>;
export type TrackingCodeFormValues = z.infer<typeof trackingCodeSchema>;
