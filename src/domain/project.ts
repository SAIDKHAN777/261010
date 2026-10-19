import { z } from "zod";

export const httpsUrlSchema = z
  .string()
  .trim()
  .max(500, "URL cannot exceed 500 characters")
  .refine(
    (val) => {
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    "Only HTTPS URL schemes are permitted"
  );

export const projectImageCoverSchema = z
  .string()
  .trim()
  .max(500, "URL cannot exceed 500 characters")
  .refine(
    (val) => {
      if (val.startsWith("/")) {
        return !val.includes("..") && !val.includes("\\");
      }
      try {
        const parsed = new URL(val);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    "Cover image must be a valid HTTPS URL or root-relative path (e.g. /uploads/image.png)"
  );

export const projectSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const cuidRegex = /^c[a-z0-9]{24}$/;

export const cuidSchema = z
  .string()
  .trim()
  .regex(cuidRegex, "Invalid CUID identifier format");

export function normalizeTechStack(items: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of items) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim().toLowerCase();
    if (trimmed.length > 0 && !seen.has(trimmed)) {
      seen.add(trimmed);
      normalized.push(trimmed);
    }
  }

  return normalized;
}

export const techStackSchema = z
  .array(z.string())
  .transform((items) => normalizeTechStack(items))
  .refine(
    (items) => items.length > 0,
    "At least one non-empty technology must be listed"
  );

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(150, "Slug cannot exceed 150 characters")
    .regex(
      projectSlugRegex,
      "Slug must only contain lowercase alphanumeric characters separated by single hyphens"
    ),
  summary: z
    .string()
    .trim()
    .min(1, "Summary is required")
    .max(300, "Summary cannot exceed 300 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required"),
  tech_stack: techStackSchema,
  repo_url: httpsUrlSchema.nullable().optional(),
  live_url: httpsUrlSchema.nullable().optional(),
  cover_image_url: projectImageCoverSchema.nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  page_size: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
  page_token: z.string().optional(),
  tech_stack: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : undefined)),
  order_by: z
    .enum(["created_at_desc", "created_at_asc"])
    .default("created_at_desc"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
