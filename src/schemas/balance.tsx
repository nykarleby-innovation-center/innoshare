import { z } from "zod"
import { l10nTextSchema } from "./l10n"
import { objectIdentifierSchema } from "./shared"

export const createBalanceSchema = z.object({
  regionId: z.string(),
  amount: z.number(),
  l10nDescription: l10nTextSchema.nullable(),
  dateRange: z.array(z.number()).length(2),
  organizationId: z.string(),
  public: z.boolean(),
  competenceId: z.string(),
})

export const updateBalanceSchema = createBalanceSchema
  .extend(objectIdentifierSchema.shape)
  .omit({
    organizationId: true,
    competenceId: true,
  })

export const unlockBalanceSchema = objectIdentifierSchema.extend({
  organizationId: z.string().nullable(),
})

export const upsertBalanceFormSchema = createBalanceSchema;