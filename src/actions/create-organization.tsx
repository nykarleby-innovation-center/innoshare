"use server"

import { createOrganizationSchema } from "@/schemas/organization"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie, signSession } from "@/utils/session"
import { getLanguageFromHeaders } from "@/utils/url"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import "server-only"

export async function createOrganization(
  data: z.infer<typeof createOrganizationSchema>
) {
  const session = await checkSessionCookie()

  const parsed = createOrganizationSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    return { success: false, error: "Invalid values" }
  }

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  const org = await prismaClient.organization.create({
    data: {
      name: parsed.data.name,
      l10nDescription: parsed.data.l10nDescription,
      website: parsed.data.website,
      onboarded: false,
      users: { connect: { id: session.userId } },
      regions: { connect: parsed.data.regionIds.map((id) => ({ id })) },
      competences: { connect: parsed.data.competenceIds.map((id) => ({ id })) },
    },
  })

  const signedSessionToken = await signSession({
    ...session,
    organizations: [
      ...session.organizations,
      {
        id: org.id,
        name: org.name,
      },
    ],
  })

  cookies().set("session", signedSessionToken!, {
    expires: session.exp * 1000,
  })

  redirect(`/${getLanguageFromHeaders()}/edit-organization/${org.id}`)
}
