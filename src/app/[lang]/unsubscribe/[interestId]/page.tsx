import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
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
import { HtmlForm } from "@/components/server/html-form"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

interface Params {
  lang: Language
  interestId: string
}

export default async function UnsubscribePage(props: {
  params: Promise<Params>
}) {
  const { lang } = await props.params

  const session = await checkSessionCookie()

  if (session) {
    redirect(`/${lang}/mail-settings`)
  }

  const interest = await prismaClient.interest.findUnique({
    where: { id: (await props.params).interestId },
  })

  if (!interest) {
    redirect(`/${lang}/`)
  }

  const unsub = async () => {
    "use server"
    try {
      await prismaClient.interest.update({
        where: {
          id: interest.id,
        },
        data: {
          receiveDigest: false,
        },
      })
    } catch (err) {
      console.error(err)
      return { success: false, error: "Invalid values" }
    }

    revalidatePath(`/sv/`)
    redirect(`/sv/`)
  }

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
      header={<PageHeader>Avprenumerera från InnoShare Weekly?</PageHeader>}
    >
      <HtmlForm action={unsub as any} className="space-y-4">
        <Button type="submit">Bekräfta avprenumerering</Button>
      </HtmlForm>
    </PageWrapper>
  )
}

export const dynamic = "force-dynamic"
