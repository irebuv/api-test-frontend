import { z } from "zod";

export const BusinessSchema = z.object({
  name: z.string().trim().min(3, "Min 3 chars").max(120, "Max 120 chars"),
  description: z.string().max(500, "Max 500 chars").optional().or(z.literal("")),
  type: z.string().min(1, "Please select a type"),
  image: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine((f) => !f || f.size <= 5_000_000, "Image must be ≤ 5MB")
    .refine((f) => !f || /^image\//.test(f.type), "Only images"),
});
export type BusinessInput = z.infer<typeof BusinessSchema>;
