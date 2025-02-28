"use server"

import { updateUserSchema } from "@/schemas/user"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie, signSession } from "@/utils/session"
import { cookies } from "next/headers"
import "server-only"

export async function updateUser(data: typeof updateUserSchema._type) {
  const session = await checkSessionCookie()

  const parsed = updateUserSchema.safeParse(data)

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  if (!parsed.success || parsed.data.id !== session.userId) {
    return { success: false, error: "Invalid values" }
  }

  await prismaClient.user.update({
    where: { id: parsed.data.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phoneNumber: parsed.data.phoneNumber,
      onboarded: true,
    },
  })

  const signedSessionToken = await signSession({
    ...session,
    userOnboarded: true,
  })

  const c = await cookies()
  c.set("session", signedSessionToken!, {
    expires: session.exp * 1000,
  })

  return { success: true }
}
