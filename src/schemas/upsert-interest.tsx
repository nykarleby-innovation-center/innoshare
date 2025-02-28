import { z } from "zod"

export const upsertInterestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  company: z.string(),
  language: z.string(),
  receiveNewsletter: z.boolean().nullable(),
  receiveDigest: z.boolean().nullable(),
})
