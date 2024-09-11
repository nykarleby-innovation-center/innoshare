import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BalanceListing } from "@/components/client/balance-listing"
import { prismaClient } from "@/utils/prisma"
import { decodeUnverifiedSessionCookie } from "@/utils/session"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { PageWrapper } from "@/components/server/page-wrapper"
import { PageHeader } from "@/components/server/page-header"

interface Params {
  lang: Language
}

interface SearchParams {
  viewOnly?: "need" | "supply"
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

export default async function BalanceListingPage({
  params: { lang },
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const unverifiedSession = decodeUnverifiedSessionCookie()

  const balances = await prismaClient.balance.findMany({
    select: {
      id: true,
      createdAt: true,
      amount: true,
      organizationId: true,
      startDate: true,
      endDate: true,
      competence: {
        select: {
          id: true,
          l10nName: true,
          iconUrl: true,
        },
      },
      region: {
        select: {
          id: true,
          l10nName: true,
        },
      },
    },
  })

  return (
    <PageWrapper
      breadcrumb={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{L10N_COMMON.home[lang]}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={<PageHeader>{L10N_COMMON.competenceBalance[lang]}</PageHeader>}
    >
      <BalanceListing
        lang={lang}
        balances={balances.map((b) => ({
          ...b,
          own:
            unverifiedSession?.organizations.some(
              (o) => b.organizationId === o.id
            ) ?? false,
        }))}
        defaultShowNeeds={
          searchParams.viewOnly ? searchParams.viewOnly === "need" : null
        }
        defaultShowSupply={
          searchParams.viewOnly ? searchParams.viewOnly === "supply" : null
        }
      />
    </PageWrapper>
  )
}
