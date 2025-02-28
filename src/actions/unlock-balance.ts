"use server"

import { unlockBalanceSchema } from "@/schemas/balance"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import "server-only"
import { EmailService } from "@/services/email/email-service"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { L10nText } from "@/types/l10n"
import { ENVIRONMENT } from "@/utils/env"

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

  const res = await prismaClient.balanceUnlock.create({
    data: {
      balance: { connect: { id: parsed.data.id } },
      user: { connect: { id: session.userId } },
      organization: parsed.data.organizationId
        ? { connect: { id: parsed.data.organizationId } }
        : undefined,
    },
    select: {
      user: {
        select: {
          email: true,
          phoneNumber: true,
          firstName: true,
          lastName: true,
        },
      },
      organization: {
        select: {
          name: true,
        },
      },
      balance: {
        select: {
          id: true,
          competence: {
            select: {
              l10nName: true,
            },
          },
          createdByUser: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  })

  // Todo, language support in database.
  Promise.all([
    EmailService.sendEmail({
      to: res.balance.createdByUser.email,
      subject: L10N_SERVER.yourCompetenceBalanceContactDetailsWereUnlocked.sv,
      message: L10N_SERVER.unlockedEmailText(
        res.balance.competence.l10nName as L10nText,
        `${res.user.firstName} ${res.user.lastName}
${res.user.email}
${res.user.phoneNumber ?? ""}
${res.organization?.name ?? ""}`
      ).sv,
    }),
    ...(ENVIRONMENT.ENABLE_SEND_NOTIFICATIONS_TO_INTERNAL === "true"
      ? [
          EmailService.sendEmail({
            toType: "internal",
            to: ENVIRONMENT.INTERNAL_NOTIFICATION_TO,
            subject: "[Innoshare] Balance unlocked",
            message: `Balance unlocked: ${res.balance.id}`,
          }),
        ]
      : []),
  ])
    .then(() => {
      console.log("Emails successfully sent")
    })
    .catch((e) => {
      console.error("Failed to send email", e)
    })

  revalidatePath(`/sv/balance/${parsed.data.id}`)
  redirect(`/sv/balance/${parsed.data.id}`)
}
