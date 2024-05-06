import { globalRateLimit } from "@/utils/rate-limit"
import { interestFormSchema } from "@/schemas/interest-form"
import { PrismaClient } from "@prisma/client"
import { EmailService } from "@/services/email/email-service"
import { ENVIRONMENT } from "@/utils/env"

export const POST = globalRateLimit(async (req: Request) => {
  const data = interestFormSchema.parse(await req.json())

  const prisma = new PrismaClient()

  await prisma.interest.create({
    data: {
      name: data.name,
      company: data.company,
      email: data.email,
      language: data.language,
    },
  })

  try {
    await EmailService.sendEmail({
      toType: "internal",
      to: ENVIRONMENT.INTERNAL_NOTIFICATION_TO,
      subject: "New interest form submission",
      message: `Name: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nLanguage: ${data.language}`,
    })

    await EmailService.sendEmail({
      to: data.email,
      subject: "New interest form submission",
      message: `Name: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nLanguage: ${data.language}`,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ success: false }, { status: 500 })
  }

  return Response.json({ success: true })
})
