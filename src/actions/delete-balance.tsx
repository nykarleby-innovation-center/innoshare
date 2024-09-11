"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { checkSessionCookie } from "../utils/session"
import { prismaClient } from "@/utils/prisma"
import { objectIdentifierSchema } from "@/schemas/shared"
import { z } from "zod"
import "server-only"

export async function deleteBalance(
  data: z.infer<typeof objectIdentifierSchema>
) {
  const session = await checkSessionCookie()

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = objectIdentifierSchema.safeParse(data)

  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error))
    return { success: false, error: "Invalid values" }
  }

  try {
    await prismaClient.balance.delete({
      where: {
        id: parsed.data.id,
        organization: {
          id: { in: session.organizations.map((org) => org.id) },
        },
      },
    })
  } catch (err) {
    console.error(err)
    return { success: false, error: "Invalid values" }
  }

  revalidatePath(`/sv/balance`)
  redirect(`/sv/balance`)
}
