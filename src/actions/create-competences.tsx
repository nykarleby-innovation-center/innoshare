"use server"

import { Language } from "@/types/language"
import { createCompetencesSchema } from "@/schemas/competence"
import { languageSchema } from "@/schemas/language"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { translate } from "@/utils/translate"
import { z } from "zod"
import "server-only"

export async function createCompetences(
  data: z.infer<typeof createCompetencesSchema>
) {
  const session = await checkSessionCookie()

  const parsed = createCompetencesSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: "Invalid values" }
  }

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const createdCompetences = await Promise.all(
    parsed.data.map(async (competence) => {
      const translatedCompetence: Record<Language, string> =
        competence.type === "translated"
          ? competence.name
          : {
              [competence.originalLanguage]: competence.name,
              ...((await translate({
                text: competence.name,
                fromLanguage: competence.originalLanguage,
                toLanguages: languageSchema.options.filter(
                  (o) => o !== competence.originalLanguage
                ),
              })) as Record<Language, string>),
            }
      const normalizedName = translatedCompetence.en
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")

      const c = await prismaClient.competence.upsert({
        where: {
          normalizedName,
        },
        update: {},
        create: {
          createdByUser: { connect: { id: session.userId } },
          normalizedName,
          l10nName: {
            en: translatedCompetence.en,
            sv: translatedCompetence.sv,
            fi: translatedCompetence.fi,
          },
        },
      })

      return { id: c.id, l10nName: c.l10nName }
    })
  )

  return { success: true, createdCompetences }
}
