import { z } from "zod"
import { languageSchema } from "./language"

export const l10nTextSchema = z.object(
  languageSchema.options.reduce((acc, lang) => {
    acc[lang] = z.string().max(10000)
    return acc
  }, {} as Record<typeof languageSchema._type, ReturnType<typeof z.string>>)
)
