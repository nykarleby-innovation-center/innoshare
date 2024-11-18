import { z } from "zod"
import { objectIdentifierSchema } from "./shared"

export const upsertCompleteBalanceSchema = z
  .object({
    public: z.boolean(),
    success: z.boolean(),
    partnerCompany: z.string(),
    comment: z.string(),
  })
  .extend(objectIdentifierSchema.shape)
