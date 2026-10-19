import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("A valid email address is required")
    .max(254, "Email cannot exceed 254 characters")
    .refine((val) => !/[\r\n]/.test(val), "Email must not contain CR or LF control characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export interface ContactResponse {
  id: string;
  status: "PENDING" | "SENT" | "PARTIAL" | "FAILED";
}
