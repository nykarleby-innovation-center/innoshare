import { z } from "zod"

export const languageSchema = z.enum(["sv", "en", "fi"])
