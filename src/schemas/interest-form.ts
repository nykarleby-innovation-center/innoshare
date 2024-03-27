import { z } from "zod";

export const interestFormSchema = z.object({
  name: z.string(),
  company: z.string(),
  email: z.string().email(),
  centriaPrivacyPolicyAccepted: z.boolean().refine((v) => v === true),
  nicPrivacyPolicyAccepted: z.boolean().refine((v) => v === true),
  acceptEmails: z.boolean().refine((v) => v === true),
  language: z.string()
});
