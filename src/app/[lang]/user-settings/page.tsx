import { L10N_SERVER } from "@/l10n/l10n-server"
import { Metadata } from "next"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { UpdateUserForm } from "@/components/client/update-user-form"
import { redirect } from "next/navigation"
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

  const searchParams = await props.searchParams

  return (
    <PageWrapper
      breadcrumb={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>{L10N_COMMON.myProfile[lang]}</BreadcrumbItem>
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
      {!session.userOnboarded && (
        <div className="mb-8">
          {L10N_SERVER.pleaseConfirmYourInformation[lang]}
        </div>
      )}
      <UpdateUserForm
        lang={lang}
        user={user}
        redirectAfter={
          !session.userOnboarded
            ? !!searchParams.redirect
              ? `/${lang}/mail-settings?${new URLSearchParams({
                  redirect: searchParams.redirect!,
                }).toString()}`
              : null
            : searchParams.redirect ?? null
        }
      />
    </PageWrapper>
  )
}

export const dynamic = "force-dynamic"
