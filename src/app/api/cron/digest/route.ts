import { EmailService } from "@/services/email/email-service"
import { L10nText } from "@/types/l10n"
import { ENVIRONMENT } from "@/utils/env"
import { prismaClient } from "@/utils/prisma"
import { globalRateLimit } from "@/utils/rate-limit"
import { NextResponse } from "next/server"

export const POST = globalRateLimit(async (req) => {
  const secret = req.nextUrl.searchParams.get("secret")

  if (secret !== ENVIRONMENT.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const latestUpdates = await prismaClient.balance.findMany({
    where: {
      updatedAt: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      competence: true,
      region: true,
      completedBalance: true,
    },
  })

  if (latestUpdates.length === 0) {
    return NextResponse.json({ success: true })
  }

  // Todo: localization

  const updatedLines = []
  const completedLines = []

  for (const update of latestUpdates) {
    const url = `${ENVIRONMENT.HOST}/sv/balance/${update.id}`

    const line = `<strong><span style="color: white; padding-left: 5px; padding-right: 5px; border-radius: 3px; background-color: ${
      update.amount > 0 ? "#0f766e" : "#c2410c"
    }">${update.amount > 0 ? "Utbud" : "Behov"}</span> <a href="${url}">${
      (update.competence.l10nName as L10nText).sv
    }</a></strong>, ${(update.region.l10nName as L10nText).sv}`
    if (update.completedBalance) {
      completedLines.push(line)
    } else {
      updatedLines.push(line)
    }
  }

  let body = `
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body style="font-family: Helvetica, sans-serif; font-size: 14px; line-height: 1.3; margin: 0; padding: 16px;">
    <img src="${ENVIRONMENT.HOST}/images/logo-dark.svg" alt="Innoshare logo" width="150" height="150"/>  
    <h1>InnoShare Weekly</h1>

    <p>Här är de senaste uppdateringarna från plattformen!</p>`

  if (updatedLines.length > 0) {
    body += `

    <h2>Nya kompetensbalanser:</h2>
    <ul>
        ${updatedLines
          .map((updatedLine) => `<li>${updatedLine}</li>`)
          .join("\n")}
    </ul>
`
  }

  if (completedLines.length > 0) {
    body += `

    <h2>Färdigställda kompetensbalanser:</h2>
    <ul>
        ${completedLines
          .map((completedLine) => `<li>${completedLine}</li>`)
          .join("\n")}
    </ul>
`
  }

  body += `
    <p style="opacity: 50%; font-size: 75%; margin-top: 30px;">Detta är ett automatiskt mailutskick. Du kan justera mailinställningar genom att <a href="${ENVIRONMENT.HOST}">logga in på plattformen</a>. Du kan också avprenumerera från InnoShare Weekly direkt genom att <a href="${ENVIRONMENT.HOST}/sv/interests/unsubscribe">klicka här</a>.</p>
  </body>
</html>
`

  const interests = await prismaClient.interest.findMany({
    where: { receiveDigest: true },
  })

  await EmailService.sendEmails({
    to: interests.map((interest) => interest.email),
    subject: "Innoshare Weekly",
    message: body,
    messageType: "html",
  })

  return NextResponse.json({ success: true })
})
