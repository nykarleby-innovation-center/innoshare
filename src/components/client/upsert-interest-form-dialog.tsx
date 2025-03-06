"use client"

import { L10N_COMMON } from "@/l10n/l10n-common"
import { useState } from "react"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Language } from "@/types/language"
import { Interest } from "@prisma/client"
import { UpsertInterestForm } from "./upsert-interest-form"

export function UpsertInterestFormDialog({ lang }: { lang: Language }) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{L10N_COMMON.thankYou[lang]}</DialogTitle>
          <DialogDescription>
            {L10N_COMMON.weWillKeepYouUpdated[lang]}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
      <DialogHeader>
        <DialogTitle> {L10N_COMMON.keepMeUpdated[lang]}</DialogTitle>
        <DialogDescription>
          {L10N_COMMON.interestSubmissionText[lang]}
        </DialogDescription>
      </DialogHeader>
      <UpsertInterestForm
        redirectAfter={null}
        interest={null}
        lang={lang}
        onSubmit={() => setSubmitted(true)}
      />
    </DialogContent>
  )
}
