import { z } from "zod";

const complaintImageSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  "Choose a valid image file."
);

export const complaintImageLimit = 5;
export const complaintImageSizeLimit = 5 * 1024 * 1024;
export const complaintImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const createComplaintSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(150),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(3000),
  address: z.string().trim().min(5, "Location must be at least 5 characters.").max(300),
  categoryId: z.string().uuid("Choose a service category."),
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
});

export const trackingCodeSchema = z.object({
  trackingCode: z.string().trim().min(1, "Enter a tracking code.").max(100),
});

export type CreateComplaintFormValues = z.infer<typeof createComplaintSchema>;
export type TrackingCodeFormValues = z.infer<typeof trackingCodeSchema>;
