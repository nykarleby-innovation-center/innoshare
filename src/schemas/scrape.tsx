import { z } from "zod"
import { languageSchema } from "./language"

export const scrapeSchema = z.object({
  url: z.string(),
  language: languageSchema,
  availableRegionsEnglish: z.array(z.string()),
})
