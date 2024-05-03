import { globalRateLimit } from "@/utils/rate-limit"
import { interestFormSchema } from "@/schemas/interest-form"
import { PrismaClient } from "@prisma/client"
import { EmailService } from "@/services/email/email-service"
import { getEnv } from "@/utils/env"

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

  EmailService.sendEmail({
    to: getEnv("INTERNAL_NOTIFICATION_EMAIL"),
    subject: "New interest form submission",
    message: `Name: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nLanguage: ${data.language}`,
  })

  return Response.json({ success: true })
})
