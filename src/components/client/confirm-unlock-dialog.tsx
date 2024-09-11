"use client"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { unlockBalance } from "@/actions/unlock-balance"
import { Prisma } from "@/utils/prisma"
import { FormControl, FormItem, FormLabel } from "../ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { useState } from "react"
import { Label } from "../ui/label"
import { Language } from "@/types/language"

export function ConfirmUnlockDialog({
  lang,
  id,
  organizations,
}: {
  lang: Language
  id: string
  organizations: Array<Pick<Prisma.Organization, "id" | "name">>
}) {
  const [organizationId, setOrganizationId] = useState<string | null>(null)

  return (
    <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
      <DialogHeader>
        <DialogTitle>{L10N_COMMON.unlockContactDetails[lang]}</DialogTitle>
        <DialogDescription>
          {L10N_COMMON.unlockContactInformationText[lang]}
        </DialogDescription>
      </DialogHeader>
      <Label>{L10N_COMMON.onBehalfOf[lang]}</Label>
      <Select
        defaultValue={organizationId ?? "_null"}
        onValueChange={(v) => setOrganizationId(v === "_null" ? null : v)}
        value={organizationId ?? "_null"}
      >
        <SelectTrigger className="">
          <SelectValue placeholder={L10N_COMMON.organization[lang]} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_null">{L10N_COMMON.individual[lang]}</SelectItem>
          {organizations.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DialogFooter>
        <div>
          <Button
            onClick={() => {
              unlockBalance({ id, organizationId })
            }}
          >
            {L10N_COMMON.unlock[lang]}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
