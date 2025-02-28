"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prismaClient } from "@/utils/prisma"
import { objectIdentifierSchema } from "@/schemas/shared"
import { z } from "zod"
import "server-only"

export async function deleteInterest(
  data: z.infer<typeof objectIdentifierSchema>
) {
  const parsed = objectIdentifierSchema.safeParse(data)

  if (!parsed.success) {
    console.error(JSON.stringify(parsed.error))
    return { success: false, error: "Invalid values" }
  }

  try {
    await prismaClient.interest.delete({
      where: {
        id: parsed.data.id,
      },
    })
  } catch (err) {
    console.error(err)
    return { success: false, error: "Invalid values" }
  }

  revalidatePath(`/sv/`)
  redirect(`/sv/`)
}
