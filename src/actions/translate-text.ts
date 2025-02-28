"use server"

import { translateTextSchema } from "@/schemas/translate"
import { checkSessionCookie } from "@/utils/session"
import { translate } from "@/utils/translate"
import { z } from "zod"
import "server-only"

export async function translateText(data: z.infer<typeof translateTextSchema>) {
  const session = await checkSessionCookie()

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = translateTextSchema.safeParse(data)

  if (!parsed.success) {
    return { error: "Invalid input" }
  }

  const res = await translate(parsed.data)

  if (!res) {
    return { success: false, error: "Internal server error" }
  }

  return {
    translation: res,
  }
}
