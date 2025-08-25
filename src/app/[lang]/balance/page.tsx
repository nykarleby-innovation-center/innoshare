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
import {
  checkSessionCookie,
  decodeUnverifiedSessionCookie,
} from "@/utils/session"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { PageWrapper } from "@/components/server/page-wrapper"
import { PageHeader } from "@/components/server/page-header"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Params {
  lang: Language
}

interface SearchParams {
  viewOnly?: "need" | "supply"
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

export default async function BalanceListingPage(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams
  const { lang } = await props.params

  const unverifiedSession = await decodeUnverifiedSessionCookie()
  const verifiedSession = unverifiedSession && (await checkSessionCookie())

  const allBalances = await prismaClient.balance.findMany({
    where: verifiedSession
      ? {
          OR: [
            {
              completedBalanceId: null,
            },
            {
              organizationId: {
                in: verifiedSession.organizations.map((o) => o.id) ?? [],
              },
            },
          ],
        }
      : {
          OR: [
            {
              completedBalance: { public: true },
            },
            { completedBalanceId: null },
          ],
        },
    select: {
      id: true,
      createdAt: true,
      amount: true,
      organizationId: true,
      startDate: true,
      endDate: true,
      completedBalanceId: true,
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
  const publicBalances = await prismaClient.balance.findMany({
    where: { public: true },
    select: {
      id: true,
      organizationId: true,
      organization: {
        select: {
          name: true,
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
              <BreadcrumbLink href={`/${lang}`}>
                {L10N_COMMON.home[lang]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <div className="flex flex-col gap-4 mb-8 sm:mb-16 sm:items-center sm:flex-row ">
          <PageHeader className="mb-0">
            {L10N_COMMON.competenceBalance[lang]}
          </PageHeader>
          <Link href={`/${lang}/new-balance`}>
            <Button variant="ghost">
              <PlusIcon className="mr-2 w-4 h-4" /> {L10N_COMMON.create[lang]}
            </Button>
          </Link>
        </div>
      }
    >
      <BalanceListing
        lang={lang}
        publicOrganizationBalances={publicBalances.reduce(
          (acc, balance) => {
            const org = acc.find(
              (o) => o.organizationId === balance.organizationId
            )
            if (org) {
              org.balanceIds.push(balance.id)
            } else {
              acc.push({
                organizationId: balance.organizationId,
                organizationName: balance.organization.name,
                balanceIds: [balance.id],
              })
            }
            return acc
          },
          [] as Array<{
            organizationId: string
            organizationName: string
            balanceIds: string[]
          }>
        )}
        balances={allBalances.map((b) => ({
          ...b,
          own:
            unverifiedSession?.organizations.some(
              (o) => b.organizationId === o.id
            ) ?? false,
        }))}
        defaultShow={searchParams.viewOnly}
      />
    </PageWrapper>
  )
}

export const dynamic = "force-dynamic"
