import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  gender: z.string(),
  // convert to data object(?)
  birthDate: z.string().date().optional(),
  // this should be a list of a few choices (enum)?
  relationship: z.string(),
  heartLevel: z
    .number()
    .int()
    .refine((value) => value >= 1 && value <= 5, {
      message: "Level must be between 1 and 5",
    }),
  race: z.string().optional(),
  country: z.string().optional(),
  // this should be a list of a few choices (enum)?
  language: z.string(),
});
