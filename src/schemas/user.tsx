import { z } from "zod"
import { objectIdentifierSchema } from "./shared"

const phoneNumberSchema = z
  .string()
  .min(6)
  .regex(/^[+]?[0-9]+$/, "Invalid phone number")

export const updateUserSchema = objectIdentifierSchema.extend({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phoneNumber: z
    .union([phoneNumberSchema, z.string().length(0), z.null()])
    .transform((s) => (s === "" ? null : s)),
})

export const updateUserFormSchema = updateUserSchema
  .omit({ phoneNumber: true })
  .extend({
    phoneNumber: z.union([phoneNumberSchema, z.string().length(0)]),
  })
