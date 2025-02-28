import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Metadata } from "next"
import { UpsertBalancePage } from "@/components/client/upsert-balance-page"
import { checkSessionCookie } from "@/utils/session"
import { prismaClient } from "@/utils/prisma"
import { redirect } from "next/navigation"
import { PageWrapper } from "@/components/server/page-wrapper"
import { PageHeader } from "@/components/server/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { L10N_COMMON } from "@/l10n/l10n-common"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Params {
  lang: Language
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { lang } = await props.params
  return {
    title: `InnoShare | ${L10N_SERVER.heroSlogan[lang]}`,
    description: L10N_SERVER.heroText1[lang],
  }
}

export default async function OrganizationSettingsPage(props: {
  params: Promise<Params>
}) {
  const { lang } = await props.params

  const session = await checkSessionCookie()
  if (!session) {
    return redirect("/api/auth/login")
  }

  if (session.organizations.length === 0) {
    return (
      <PageWrapper
        breadcrumb={
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}/balance/`}>
                  {L10N_COMMON.competenceBalance[lang]}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        }
        header={
          <PageHeader>{L10N_SERVER.createCompetenceBalance[lang]}</PageHeader>
        }
      >
        {
          <div className="flex flex-col gap-4 items-start">
            <p>{L10N_SERVER.youNeedToCreateOrganizationText[lang]}</p>
            <Link href={`/${lang}/new-organization`} passHref legacyBehavior>
              <Button>{L10N_COMMON.newOrganization[lang]}</Button>
            </Link>
          </div>
        }
      </PageWrapper>
    )
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
