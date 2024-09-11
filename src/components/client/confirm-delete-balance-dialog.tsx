"use client"
import React from "react"
import { L10N_COMMON } from "../../l10n/l10n-common"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { deleteBalance } from "../../actions/delete-balance"
import { Language } from "@/types/language"

export function ConfirmDeleteBalanceDialog({
  lang,
  id,
}: {
  lang: Language
  id: string
}) {
  return (
    <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
      <DialogHeader>
        <DialogTitle>{L10N_COMMON.deleteCompetenceBalance[lang]}</DialogTitle>
        <DialogDescription>
          {L10N_COMMON.areYouSureDeleteBalanceText[lang]}
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => deleteBalance({ id })}
          >
            {L10N_COMMON.delete[lang]}
          </Button>
        </DialogFooter>
      </DialogHeader>
    </DialogContent>
  )
}
