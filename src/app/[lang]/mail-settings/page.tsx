import { L10N_SERVER } from "@/l10n/l10n-server"
import { Metadata } from "next"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Language } from "@/types/language"
import { PageHeader } from "@/components/server/page-header"
import { PageWrapper } from "@/components/server/page-wrapper"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { UpsertInterestForm } from "@/components/client/upsert-interest-form"
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

export default async function UserSettingsPage(props: {
  params: Promise<Params>
  searchParams: Promise<{ redirect?: string }>
}) {
  const { lang } = await props.params

  const session = await checkSessionCookie()

  if (!session) {
    return redirect("/api/auth/login")
  }

  const user = await prismaClient.user.findUnique({
    where: { id: session?.userId },
  })

  if (!user) {
    return redirect("/api/auth/login")
  }

  const interest = await prismaClient.interest.findUnique({
    where: { email: user.email },
  })

  const searchParams = await props.searchParams

  return (
    <PageWrapper
      breadcrumb={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>{L10N_COMMON.mailSettings[lang]}</BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <PageHeader>
          {user?.firstName} {user?.lastName}
        </PageHeader>
      }
    >
      <UpsertInterestForm
        lang={lang}
        interest={{
          receiveDigest: false,
          receiveNewsletter: false,
          ...interest,
          email: user.email,
          name: user.firstName,
          company: session.organizations?.[0]?.name,
          language: lang,
        }}
        redirectAfter={searchParams.redirect ?? null}
      />
    </PageWrapper>
  )
}

export const dynamic = "force-dynamic"
