import { z } from "zod"

export const interestFormSchema = z.object({
  name: z.string().min(2),
  company: z.string(),
  email: z.string().email(),
  privacyPolicyAccepted: z.boolean().refine((v) => v === true),
  acceptDigest: z.boolean(),
  acceptNewsletter: z.boolean(),
  language: z.string(),
});
