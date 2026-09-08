import { z } from "zod";

import { enquiryOptions } from "@/lib/content";

/**
 * Shared by the client form and the server action, so validation cannot drift
 * between them. The server re-validates regardless of what the client sent.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Your name is required.")
    .max(120, "That name is longer than expected."),
  email: z
    .string()
    .trim()
    .min(1, "An email address is required.")
    .email("That does not look like an email address.")
    .max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  type: z.enum(enquiryOptions, {
    message: "Choose the closest enquiry type.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail would help.")
    .max(4000, "Please keep this under 4000 characters."),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  /** Honeypot. Real people leave this empty; bots fill every field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level messages, keyed by field name. */
  errors?: Partial<Record<keyof ContactInput, string>>;
};
