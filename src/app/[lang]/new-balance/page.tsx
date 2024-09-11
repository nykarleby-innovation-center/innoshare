import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Metadata } from "next"
import { UpsertBalancePage } from "@/components/client/upsert-balance-page"
import { checkSessionCookie } from "@/utils/session"
import { prismaClient } from "@/utils/prisma"
import { redirect } from "next/navigation"

interface Params {
  lang: Language
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  return {
    title: `InnoShare | ${L10N_SERVER.heroSlogan[params.lang]}`,
    description: L10N_SERVER.heroText1[params.lang],
  }
}

export default async function OrganizationSettingsPage({
  params: { lang },
}: {
  params: Params
}) {
  const session = await checkSessionCookie()
  if (!session) {
    return redirect("/api/auth/login")
  }

  if (session.organizations.length === 0) {
    return redirect("/sv/new-organization")
  }

  const organizations = await prismaClient.organization.findMany({
    where: {
      id: {
        in: session.organizations.map((org) => org.id),
      },
    },
    select: {
      id: true,
      name: true,
      regions: { select: { id: true, l10nName: true } },
    },
  })
  const competences = await prismaClient.competence.findMany({
    select: {
      id: true,
      l10nName: true,
    },
  })

  return (
    <UpsertBalancePage
      lang={lang}
      organizations={organizations}
      competences={competences}
      editingBalance={null}
    />
  )
}

export const dynamic = "force-dynamic"
