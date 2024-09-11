"use server"

import { unlockBalanceSchema } from "@/schemas/balance"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import "server-only"

export async function unlockBalance(data: z.infer<typeof unlockBalanceSchema>) {
  const session = await checkSessionCookie()

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = unlockBalanceSchema.safeParse(data)

  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error))
    return { success: false, error: "Invalid values" }
  }

  await prismaClient.balanceUnlock.create({
    data: {
      balance: { connect: { id: parsed.data.id } },
      user: { connect: { id: session.userId } },
      organization: parsed.data.organizationId
        ? { connect: { id: parsed.data.organizationId } }
        : undefined,
    },
  })

  revalidatePath(`/sv/balance/${parsed.data.id}`)
  redirect(`/sv/balance/${parsed.data.id}`)
}
