import { z } from "zod"
import { l10nTextSchema } from "./l10n"
import { objectIdentifierSchema } from "./shared"

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  l10nDescription: l10nTextSchema,
  website: z.string().min(2).max(100).url(),
  regionIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one region.",
  }),
  competenceIds: z.array(z.string()),
})

export const updateOrganizationSchema = createOrganizationSchema.extend(
  objectIdentifierSchema.shape
)

export const upsertOrganizationFormSchema = createOrganizationSchema
