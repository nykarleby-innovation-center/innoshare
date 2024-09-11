import { UpsertOrganizationForm } from "@/components/client/upsert-organization-form"
import { PageHeader } from "@/components/server/page-header"
import { PageWrapper } from "@/components/server/page-wrapper"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { Metadata } from "next"
import { redirect } from "next/navigation"

interface Params {
  lang: Language
  organizationId: string
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
  params: { lang, organizationId },
}: {
  params: Params
}) {
  const session = await checkSessionCookie()

  if (!session) {
    return redirect("/api/auth/login")
  }

  const organization = await prismaClient.organization.findUnique({
    where: {
      id: organizationId,
      users: {
        some: {
          id: session?.userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      l10nDescription: true,
      website: true,
      regions: { select: { id: true } },
      competences: { select: { id: true } },
    },
  })

  if (!organization) {
    return redirect("/api/auth/login")
  }

  const regions = await prismaClient.region.findMany({
    select: {
      id: true,
      l10nName: true,
    },
  })
  const competences = await prismaClient.competence.findMany({
    select: {
      id: true,
      l10nName: true,
    },
  })

  return (
    <PageWrapper
      breadcrumb={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>{L10N_COMMON.organizations[lang]}</BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={<PageHeader>{organization.name}</PageHeader>}
    >
      <UpsertOrganizationForm
        lang={lang}
        editingOrganization={{
          ...organization,
          regionIds: organization.regions.map((r) => r.id),
          competenceIds: organization.competences.map((c) => c.id),
        }}
        regions={regions}
        competences={competences}
      />
    </PageWrapper>
  )
}
