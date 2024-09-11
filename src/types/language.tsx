import { z } from "zod"
import { languageSchema } from "../schemas/language"

export type Language = z.infer<typeof languageSchema>
