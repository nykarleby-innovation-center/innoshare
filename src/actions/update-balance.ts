"use server"

import { updateBalanceSchema } from "@/schemas/balance"
import { Prisma, prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import "server-only"

export async function updateBalance(data: z.infer<typeof updateBalanceSchema>) {
  const session = await checkSessionCookie()

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = updateBalanceSchema.safeParse(data)

  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error))
    return { success: false, error: "Invalid values" }
  }

  try {
    await prismaClient.balance.update({
      where: {
        id: parsed.data.id,
        organization: {
          id: { in: session.organizations.map((org) => org.id) },
        },
      },
      data: {
        amount: parsed.data.amount,
        l10nDescription: parsed.data.l10nDescription ?? Prisma.Prisma.DbNull,
        startDate: new Date(parsed.data.dateRange[0]),
        endDate: new Date(parsed.data.dateRange[1]),
        region: { connect: { id: parsed.data.regionId } },
        public: parsed.data.public
      },
    })
  } catch (err) {
    console.error(err)
    return { success: false, error: "Invalid values" }
  }

  revalidatePath(`/sv/balance/${parsed.data.id}`)
  revalidatePath(`/sv/balance/${parsed.data.id}/edit`)
  redirect(`/sv/balance/${parsed.data.id}`)
}
