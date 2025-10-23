import { z } from "zod";

export const RequestSchema = z.object({
  name: z.string().trim().min(2, "Min 2 chars").max(120),
  phone: z
  .string()
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, "Phone must be 10–15 digits")
  .transform(s => s.replace(/\s+/g, "")),
  date: z.string().min(1, "Select a date"),
  description: z.string().max(500).optional().or(z.literal("")),
});
export type RequestInput = z.infer<typeof RequestSchema>;
