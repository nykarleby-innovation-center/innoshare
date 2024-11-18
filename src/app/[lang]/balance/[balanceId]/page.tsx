import { L10N_SERVER } from "@/l10n/l10n-server"
import { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowRightIcon,
  Calendar,
  CheckIcon,
  MapPin,
  PenIcon,
  User,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { prismaClient } from "@/utils/prisma"
import { decodeUnverifiedSessionCookie } from "@/utils/session"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { L10nText } from "@/types/l10n"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { cn } from "@/utils/ui"
import { Language } from "@/types/language"
import { PageWrapper } from "@/components/server/page-wrapper"
import { UnlockBalanceSection } from "@/components/server/unlock-balance-section"
import { CompleteBalanceDialog } from "@/components/client/upsert-complete-balance-dialog"
import { CompletedBalanceSection } from "@/components/server/completed-balance-section"
import { Badge } from "@/components/ui/badge"

interface Params {
  lang: Language
  balanceId: string
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

export default async function BalancePage({
  params: { lang, balanceId },
}: {
  params: Params
}) {
  const unverifiedSession = decodeUnverifiedSessionCookie()

  const balance = await prismaClient.balance.findUnique({
    where: {
      id: balanceId,
    },
    select: {
      id: true,
      l10nDescription: true,
      amount: true,
      startDate: true,
      endDate: true,
      organizationId: true,
      competence: {
        select: {
          id: true,
          l10nName: true,
          iconUrl: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      region: {
        select: {
          id: true,
          l10nName: true,
        },
      },
      completedBalance: true,
    },
  })

  if (!balance) {
    return null
  }

  const unverifiedOwnBalance = unverifiedSession
    ? unverifiedSession.organizations.some(
        (o) => o.id === balance.organization.id
      )
    : false

  return (
    <>
      <PageWrapper
        breadcrumb={
          <Breadcrumb className="mb-12">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}`}>
                  {L10N_COMMON.home[lang]}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}/balance`}>
                  {L10N_COMMON.competenceBalance[lang]}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        }
        header={
          <div
            className={cn(
              "relative rounded-lg px-5 pt-5 pb-2 border-2 mb-4 max-w-3xl self-start mt-36 lg:mt-0",
              balance.amount < 0
                ? "border-orange-400 shadow-md shadow-orange-500/20"
                : "border-teal-500 shadow-md shadow-teal-500/20"
            )}
          >
            <div
              className={cn(
                "text-secondary uppercase pt-[2px] font-black px-4 rounded-full absolute -top-3 mb-2",
                balance.amount < 0
                  ? `bg-orange-400 shadow-md shadow-orange-500/20`
                  : `bg-teal-400 shadow-md shadow-teal-500/20`
              )}
            >
              {balance.amount < 0
                ? L10N_COMMON.need[lang]
                : L10N_COMMON.supply[lang]}
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {(balance.competence.l10nName as L10nText)[lang]},{" "}
              {(balance.region.l10nName as L10nText)[lang]}
            </h1>
          </div>
        }
      >
        <div className="absolute top-0 right-0 w-48 h-48">
          {balance.competence.iconUrl ? (
            <Image
              className="object-contain object-center mix-blend-multiply -mr-6 opacity-85 contrast-200 dark:invert dark:mix-blend-screen"
              src={balance.competence.iconUrl}
              alt={(balance.competence.l10nName as L10nText)[lang]}
              fill
            />
          ) : (
            <Skeleton className="absolute w-full h-full" />
          )}
        </div>
        <div className="flex flex-col gap-6 mb-8 mt-4 lg:mt-0 lg:h-12 lg:flex-row">
          {balance.completedBalance && (
            <>
              <Badge
                variant="secondary"
                className={cn(
                  "flex flex-row gap-2 items-center text-sm px-4 py-2 lg:self-center",
                  balance.amount < 0 ? "text-orange-500" : "text-teal-500"
                )}
              >
                <CheckIcon className="w-5 h-5" />
                <div>{L10N_COMMON.completed[lang]}</div>
              </Badge>
            </>
          )}
          <div className="flex flex-row gap-2 items-center">
            <MapPin className="w-5 h-5" />
            <div>{(balance.region.l10nName as L10nText)[lang]}</div>
          </div>
          <Separator orientation="vertical" className="hidden lg:block" />
          <Separator orientation="horizontal" className="block lg:hidden" />
          <div className="flex flex-row gap-2 items-center">
            <User className="w-5 h-5" />
            <div>{Math.abs(balance.amount)}</div>
          </div>
          <Separator orientation="vertical" className="hidden lg:block" />
          <Separator orientation="horizontal" className="block lg:hidden" />
          <div className="flex flex-row gap-2 items-center">
            <Calendar className="w-5 h-5" />
            <div className="flex flex-row gap-1 items-center">
              {balance.startDate.toLocaleDateString("fi")}
              <ArrowRightIcon className="w-3 h-3 mx-2" />
              {balance.endDate.toLocaleDateString("fi")}
            </div>
          </div>
          {unverifiedOwnBalance ? (
            <>
              <Separator orientation="vertical" />
              <div className="flex flex-row gap-2">
                <Button variant="outline" asChild className="place-self-center">
                  <Link href={`/${lang}/balance/${balance.id}/edit`}>
                    <PenIcon className="mr-4 w-4 h-4" />
                    {L10N_COMMON.edit[lang]}
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="place-self-center">
                      <CheckIcon className="mr-4 w-4 h-4" />
                      {balance.completedBalance
                        ? L10N_COMMON.editResult[lang]
                        : L10N_COMMON.complete[lang]}
                    </Button>
                  </DialogTrigger>
                  <CompleteBalanceDialog
                    lang={lang}
                    id={balance.id}
                    updatingCompletedBalance={balance.completedBalance}
                  />
                </Dialog>
              </div>
            </>
          ) : null}
        </div>
        {balance.l10nDescription && (
          <p className="mb-12 whitespace-pre-wrap">
            {(balance.l10nDescription as L10nText)[lang]}
          </p>
        )}
        {balance.completedBalance ? (
          <CompletedBalanceSection
            balance={balance}
            lang={lang}
            guest={!unverifiedSession}
          />
        ) : null}
        <UnlockBalanceSection
          balance={balance}
          lang={lang}
          guest={!unverifiedSession}
        />
      </PageWrapper>
    </>
  )
}
