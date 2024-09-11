import { z } from "zod"
import { languageSchema } from "./language"

export const translateTextSchema = z.object({
  text: z.string(),
  fromLanguage: languageSchema,
  toLanguages: z.array(languageSchema).min(1).max(2),
})
