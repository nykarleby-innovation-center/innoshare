"use server"

import { createBalanceSchema } from "@/schemas/balance"
import { AiService } from "@/services/ai/ai-service"
import { StorageService } from "@/services/storage/storage-service"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { getLanguageFromHeaders } from "@/utils/url"
import { redirect } from "next/navigation"
import { z } from "zod"
import "server-only"

export async function createBalance(data: z.infer<typeof createBalanceSchema>) {
  const session = await checkSessionCookie()

  const parsed = createBalanceSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: "Invalid values" }
  }

  if (
    !session ||
    !session.organizations.some((org) => org.id === parsed.data.organizationId)
  ) {
    return { success: false, error: "Unauthorized" }
  }

  const balance = await prismaClient.balance.create({
    data: {
      createdByUser: { connect: { id: session.userId } },
      organization: { connect: { id: parsed.data.organizationId } },
      competence: { connect: { id: parsed.data.competenceId } },
      amount: parsed.data.amount,
      l10nDescription: parsed.data.l10nDescription ?? undefined,
      startDate: new Date(parsed.data.dateRange[0]),
      endDate: new Date(parsed.data.dateRange[1]),
      region: { connect: { id: parsed.data.regionId } },
    },
    include: {
      competence: {
        select: {
          id: true,
          l10nName: true,
          iconUrl: true,
        },
      },
    },
  })

  if (!balance.competence.iconUrl) {
    AiService.generateImage({
      prompt: `A black and white icon (white background, no shadows, only use full black and full white colors) this job title: ${
        (balance.competence.l10nName as any).en
      }`,
    }).then((image) => {
      const path = `competence-icons/${balance.competence.id}.png`
      StorageService.uploadFile({
        data: image,
        access: "public",
        path,
      }).then(() =>
        StorageService.getPublicFileUrl(path).then((iconUrl) =>
          prismaClient.competence.update({
            where: { id: balance.competence.id },
            data: { iconUrl },
          })
        )
      )
    })
  }

  redirect(`/${await getLanguageFromHeaders()}/balance/${balance.id}`)
}
