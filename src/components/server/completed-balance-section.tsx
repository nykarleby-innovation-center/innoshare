import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Prisma } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { CheckCircleIcon } from "lucide-react"
import { Language } from "@/types/language"
import { L10N_COMMON } from "@/l10n/l10n-common"

export async function CompletedBalanceSection({
  balance,
  lang,
  guest,
}: {
  balance: Pick<Prisma.Balance, "id" | "amount" | "organizationId"> & {
    organization: Pick<Prisma.Organization, "name">
    completedBalance: Prisma.CompletedBalance | null
  }
  lang: Language
  guest: boolean
}) {
  const verifiedSession = guest ? null : await checkSessionCookie()

  const ownBalance =
    verifiedSession &&
    verifiedSession.organizations.some((o) => o.id === balance.organizationId)

  const showDetails = ownBalance || balance.completedBalance?.public

  if (balance.completedBalance) {
    return (
      <Card className="max-w-xl mb-8">
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 items-center">
            <CheckCircleIcon className="w-6 h-6 mb-2" />
            {balance.completedBalance.success
              ? L10N_COMMON.successfullyShared[lang]
              : L10N_COMMON.competenceSharingCompleted[lang]}
          </CardTitle>
          {showDetails && balance.completedBalance.partnerCompany ? (
            <CardDescription>
              {L10N_COMMON.competenceWasSharedBetweenText[lang][0]}{" "}
              {balance.organization.name}{" "}
              {L10N_COMMON.competenceWasSharedBetweenText[lang][1]}{" "}
              {balance.completedBalance.partnerCompany}.
            </CardDescription>
          ) : null}
        </CardHeader>
        {showDetails && balance.completedBalance.comment ? (
          <CardContent>
            {'"'}
            {balance.completedBalance.comment}
            {'"'}
          </CardContent>
        ) : null}
      </Card>
    )
  }
}
