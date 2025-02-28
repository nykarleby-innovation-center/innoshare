import { Language } from "@/types/language"
import { headers } from "next/headers"

export const getLanguageFromHeaders = async () => {
  const h = await headers()

  const origin = h.get("origin")
  const referer = h.get("referer")

  if (!origin || !referer) {
    return "en" as Language
  }

  const path = referer.replace(origin, "")
  const lang = path.split("/")[1]

  return lang as Language
}
