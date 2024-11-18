"use server"

import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { getLanguageFromHeaders } from "@/utils/url"
import { z } from "zod"
import "server-only"
import { revalidatePath } from "next/cache"
import { upsertCompleteBalanceSchema } from "@/schemas/completed-balance"

export async function upsertCompletedBalance(
  data: z.infer<typeof upsertCompleteBalanceSchema>
) {
  const session = await checkSessionCookie()

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = upsertCompleteBalanceSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: "Invalid values" }
  }

  await prismaClient.balance.update({
    where: {
      id: parsed.data.id,
      organization: {
        id: { in: session.organizations.map((org) => org.id) },
      },
    },
    data: {
      completedBalance: {
        upsert: {
          create: {
            public: parsed.data.public,
            success: parsed.data.success,
            partnerCompany: parsed.data.partnerCompany,
            comment: parsed.data.comment,
          },
          update: {
            public: parsed.data.public,
            success: parsed.data.success,
            partnerCompany: parsed.data.partnerCompany,
            comment: parsed.data.comment,
          },
        },
      },
    },
  })

  revalidatePath(`/${getLanguageFromHeaders()}/balance/${parsed.data.id}`)
}
