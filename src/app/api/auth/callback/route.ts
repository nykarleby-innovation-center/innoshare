import { getAccessToken, getUserInfo } from "@/utils/auth"
import { NextRequest, NextResponse } from "next/server"
import { prismaClient } from "@/utils/prisma"
import { cookies } from "next/headers"
import { signSession } from "@/utils/session"
import { ENVIRONMENT } from "@/utils/env"

export const GET = async (req: NextRequest) => {
  const token = await getAccessToken(req.nextUrl.searchParams.get("code")!)

  if (!token) {
    console.error("No token found")
    return NextResponse.redirect("/")
  }

  const userInfo = await getUserInfo(token.accessToken)

  if (!userInfo.email) {
    console.error("No email found in user info")
    return NextResponse.redirect("/")
  }

  const user = await prismaClient.user.upsert({
    where: { email: userInfo.email },
    create: {
      email: userInfo.email!,
      firstName: userInfo.given_name ?? "",
      lastName: userInfo.family_name ?? "",
      onboarded: false,
    },
    update: {},
    include: {
      organizations: { select: { id: true, name: true } },
    },
  })

  const signedSessionToken = await signSession({
    userId: user.id,
    userOnboarded: user.onboarded,
    firstName: user.firstName,
    organizations: user.organizations.map((org) => ({
      id: org.id,
      name: org.name,
    })),
  })

  const c = await cookies()
  c.set("session", signedSessionToken!, {
    expires: +new Date() + 1000 * 60 * 60 * 24 * 2,
  })

  return NextResponse.redirect(ENVIRONMENT.HOST)
}
