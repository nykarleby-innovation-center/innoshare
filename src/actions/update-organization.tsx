"use server"

import { updateOrganizationSchema } from "@/schemas/organization"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie, signSession } from "@/utils/session"
import { getLanguageFromHeaders } from "@/utils/url"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"
import "server-only"

export async function updateOrganization(
  data: z.infer<typeof updateOrganizationSchema>
) {
  const session = await checkSessionCookie()

  const parsed = updateOrganizationSchema.safeParse(data)

  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  if (
    !parsed.success ||
    !session.organizations.some((org) => org.id === parsed.data.id)
  ) {
    return { success: false, error: "Unauthorized" }
  }

  const org = await prismaClient.organization.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      l10nDescription: parsed.data.l10nDescription,
      website: parsed.data.website,
      onboarded: false,
      regions: { set: parsed.data.regionIds.map((id) => ({ id })) },
      competences: { set: parsed.data.competenceIds.map((id) => ({ id })) },
    },
  })

  const modifiedSessionOrgs = session.organizations.map((org) => {
    if (org.id === parsed.data.id) {
      return {
        id: org.id,
        name: parsed.data.name,
      }
    }
    return org
  })

  const signedSessionToken = await signSession({
    ...session,
    organizations: modifiedSessionOrgs,
  })

  const c = await cookies()
  c.set("session", signedSessionToken!, {
    expires: session.exp * 1000,
  })

  revalidatePath(`/${await getLanguageFromHeaders()}/update-organization/${org.id}`)
}
