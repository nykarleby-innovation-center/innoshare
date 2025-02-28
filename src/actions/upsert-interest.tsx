"use server"
import "server-only"

import { z } from "zod"
import { upsertInterestSchema } from "@/schemas/upsert-interest"
import { prismaClient } from "@/utils/prisma"

export async function updateInterest(
  data: z.infer<typeof upsertInterestSchema>
) {
  const parsed = upsertInterestSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: "Invalid input" }
  }

  await prismaClient.interest.upsert({
    where: { email: parsed.data.email },
    create: {
      receiveNewsletter: parsed.data.receiveNewsletter ?? undefined,
      receiveDigest: parsed.data.receiveDigest ?? undefined,
      email: parsed.data.email,
      name: parsed.data.name,
      company: parsed.data.company,
      language: parsed.data.language,
    },
    update: {
      receiveNewsletter: parsed.data.receiveNewsletter ?? undefined,
      receiveDigest: parsed.data.receiveDigest ?? undefined,
      name: parsed.data.name,
      company: parsed.data.company,
    },
  })

  return {
    success: true,
  }
}
