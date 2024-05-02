import { globalRateLimit } from "@/utils/rate-limit"
import { interestFormSchema } from "@/schemas/interest-form"
import { PrismaClient } from "@prisma/client"

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

  return Response.json([])
})
