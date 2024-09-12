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

export default async function UserSettingsPage({
  params: { lang },
}: {
  params: Params
}) {
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

  return (
    <PageWrapper
      breadcrumb={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>Min profil</BreadcrumbItem>
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
        <div className="mb-8">{L10N_SERVER.pleaseConfirmYourInformation[lang]}</div>
      )}
      <UpdateUserForm lang={lang} user={user} />
    </PageWrapper>
  )
}

export const dynamic = "force-dynamic"
