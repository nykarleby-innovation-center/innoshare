import { z } from "zod"
import { languageSchema } from "./language"

export const createCompetencesSchema = z.array(
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("translated"),
      name: z.object({
        en: z.string(),
        sv: z.string(),
        fi: z.string(),
      }),
    }),
    z.object({
      type: z.literal("untranslated"),
      originalLanguage: languageSchema,
      name: z.string(),
    }),
  ])
)
