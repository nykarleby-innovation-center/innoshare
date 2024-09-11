import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Prisma, prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import {
  EyeIcon,
  LockOpenIcon,
  MailIcon,
  PartyPopperIcon,
  PhoneIcon,
  Unlock,
  UserIcon,
} from "lucide-react"
import { ConfirmUnlockDialog } from "../client/confirm-unlock-dialog"
import { Separator } from "../ui/separator"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Language } from "@/types/language"
import Link from "next/link"

export async function UnlockBalanceSection({
  balance,
  lang,
}: {
  balance: Pick<Prisma.Balance, "id" | "amount" | "organizationId">
  lang: Language
}) {
  const verifiedSession = await checkSessionCookie()

  const ownBalance =
    verifiedSession &&
    verifiedSession.organizations.some((o) => o.id === balance.organizationId)

  if (ownBalance) {
    const unlocks = await prismaClient.balanceUnlock.findMany({
      where: {
        balanceId: balance.id,
      },
      select: {
        id: true,
        organization: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        createdAt: true,
      },
    })

    if (unlocks.length === 0) {
      return (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="flex flex-row gap-2 items-center">
              <PartyPopperIcon className="w-6 h-6 mb-2" />
              {L10N_SERVER.itsLive[lang]}
            </CardTitle>
            <CardDescription>{L10N_SERVER.nowPublicText[lang]}</CardDescription>
          </CardHeader>
          <CardContent>{L10N_SERVER.noOneUnlockedText[lang]}</CardContent>
        </Card>
      )
    } else {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row gap-2 items-center">
              <EyeIcon className="w-6 h-6 mb-2" />
              {L10N_SERVER.peopleAreInterested[lang]}
            </CardTitle>
            <CardDescription>{L10N_SERVER.unlockersText[lang]}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col gap-4">
              {unlocks.map((unlock) => (
                <>
                  <Separator className="mb-2" />
                  <div
                    key={unlock.id}
                    className="grid grid-cols-[25px_1fr] items-start"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="flex flex-col gap-2">
                      <p className="font-medium leading-none">
                        {unlock.user.firstName} {unlock.user.lastName}
                        {unlock.organization && (
                          <span className="ml-4 text-muted-foreground">
                            {unlock.organization?.name}
                          </span>
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex gap-2 items-center">
                          <MailIcon className="w-4 h-4 mb-1" />
                          {unlock.user.email}
                        </div>
                        {unlock.user.phoneNumber && (
                          <div className="flex gap-2 items-center">
                            <PhoneIcon className="w-4 h-4 mb-1" />
                            {unlock.user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  const unlocked =
    verifiedSession &&
    (await prismaClient.balanceUnlock.findUnique({
      where: {
        userId_balanceId: {
          userId: verifiedSession.userId,
          balanceId: balance.id,
        },
      },
      select: {
        createdAt: true,
        organization: {
          select: {
            name: true,
          },
        },
        balance: {
          select: {
            organization: {
              select: {
                name: true,
              },
            },
            createdByUser: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    }))

  if (unlocked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 items-center">
            <LockOpenIcon className="w-6 h-6 mb-2" />
            {unlocked.balance.organization.name}
          </CardTitle>
          <CardDescription>
            {L10N_SERVER.contactInformationUnlockedText[lang]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <UserIcon className="w-4 h-4" />
            {unlocked.balance.createdByUser.firstName}{" "}
            {unlocked.balance.createdByUser.lastName}
          </div>
          <div className="flex gap-2 items-center">
            <MailIcon className="w-4 h-4" />
            {unlocked.balance.createdByUser.email}
          </div>
          {unlocked.balance.createdByUser.phoneNumber && (
            <div className="flex gap-2 items-center">
              <PhoneIcon className="w-4 h-4" />
              {unlocked.balance.createdByUser.phoneNumber}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {L10N_SERVER.youUnlockedForText[lang][0]}{" "}
          {unlocked.createdAt.toLocaleDateString("fi")}{" "}
          {L10N_SERVER.youUnlockedForText[lang][1]}{" "}
          {unlocked.organization?.name ?? `${verifiedSession.firstName}`}
          {L10N_SERVER.youUnlockedForText[lang][2]}
        </CardFooter>
      </Card>
    )
  }

  const ownOrganizations =
    verifiedSession &&
    (await prismaClient.organization.findMany({
      where: {
        users: { some: { id: verifiedSession.userId } },
      },
      select: {
        id: true,
        name: true,
      },
    }))

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          {balance.amount < 0
            ? L10N_SERVER.canYouFillThisNeed[lang]
            : L10N_SERVER.areYouInNeedOfThis[lang]}
        </CardTitle>
        <CardDescription>
          {L10N_COMMON.unlockContactInformationText[lang]}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {verifiedSession && ownOrganizations ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="">
                <Unlock className="mr-2 w-4 h-4" />
                {L10N_COMMON.unlockContactDetails[lang]}
              </Button>
            </DialogTrigger>
            <ConfirmUnlockDialog
              lang={lang}
              organizations={ownOrganizations}
              id={balance.id}
            />
          </Dialog>
        ) : (
          <Link href={`/api/auth/login`} legacyBehavior passHref locale="false">
            <Button className="">
              <Unlock className="mr-2 w-4 h-4" />
              {L10N_COMMON.unlockContactDetails[lang]}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
