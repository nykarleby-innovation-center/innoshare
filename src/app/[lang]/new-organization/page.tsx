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

export default async function NewOrganizationPage(props: {
  params: Promise<Params>
}) {
  const { lang } = await props.params

  const session = await checkSessionCookie()
  if (!session) {
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
      header={<PageHeader>{L10N_COMMON.newOrganization[lang]}</PageHeader>}
    >
      <UpsertOrganizationForm
        lang={lang}
        editingOrganization={null}
        regions={regions}
        competences={competences}
      />
    </PageWrapper>
  )
}

export const dynamic = "force-dynamic"
