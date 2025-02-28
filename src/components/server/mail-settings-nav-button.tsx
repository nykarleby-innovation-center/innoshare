import { L10N_COMMON } from "@/l10n/l10n-common"
import { prismaClient } from "@/utils/prisma"
import { checkSessionCookie } from "@/utils/session"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { MailIcon } from "lucide-react"
import { UpsertInterestFormDialog } from "../client/upsert-interest-form-dialog"

export const MailSettingsNavButton = async () => {
  const session = await checkSessionCookie()
  if (!session) {
    return null
  }
  const user = await prismaClient.user.findUnique({
    where: { id: session?.userId },
  })
  const interest = prismaClient.interest.findUnique({
    where: { email: user?.email },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem className="cursor-pointer">
          <MailIcon className="w-4 h-4 mr-2" />
          {L10N_COMMON.mailSettings.sv}
        </DropdownMenuItem>
      </DialogTrigger>

      <UpsertInterestFormDialog lang={"sv"} />
    </Dialog>
  )
}
