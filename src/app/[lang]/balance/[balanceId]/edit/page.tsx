import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Metadata } from "next"
import { UpsertBalancePage } from "@/components/client/upsert-balance-page"
import { checkSessionCookie } from "@/utils/session"
import { prismaClient } from "@/utils/prisma"
import { redirect } from "next/navigation"

interface Params {
  balanceId: string
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

export default async function EditBalancePage({
  params: { lang, balanceId },
}: {
  params: Params
}) {
  const session = await checkSessionCookie()
  if (!session) {
    return redirect("/api/auth/login")
  }

  const balance = await prismaClient.balance.findUnique({
    where: {
      id: balanceId,
      organization: {
        id: {
          in: session.organizations.map((org) => org.id),
        },
      },
    },

    select: {
      id: true,
      startDate: true,
      endDate: true,
      amount: true,
      l10nDescription: true,
      regionId: true,
      organizationId: true,
      competenceId: true,
      competence: {
        select: {
          id: true,
          l10nName: true,
        },
      },
    },
  })
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

  if (!balance) {
    return redirect(`/${lang}`)
  }

  return (
    <UpsertBalancePage
      lang={lang}
      organizations={organizations}
      competences={[balance.competence]}
      editingBalance={balance}
    />
  )
}
