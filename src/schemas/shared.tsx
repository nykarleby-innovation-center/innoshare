import { z } from "zod"

export const objectIdentifierSchema = z.object({
  id: z.string(),
})
