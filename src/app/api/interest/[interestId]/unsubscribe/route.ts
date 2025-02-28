import { ENVIRONMENT } from "@/utils/env"
import { prismaClient } from "@/utils/prisma"
import { globalRateLimit } from "@/utils/rate-limit"
import { NextRequest, NextResponse } from "next/server"

export const GET = globalRateLimit(
  async (req, { params }: { params: Promise<{ interestId: string }> }) => {
    const { interestId } = await params

    if (
      prismaClient.interest.findUnique({ where: { id: interestId } }) === null
    ) {
      return NextResponse.redirect(`${ENVIRONMENT.HOST}/`)
    }

    await prismaClient.interest.delete({
      where: { id: interestId },
    })

    return NextResponse.redirect(`${ENVIRONMENT.HOST}/?unsubscribed=true`)
  }
)
