"use client"
import React from "react"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Language } from "@/types/language"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { HtmlForm } from "../server/html-form"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { TrashIcon } from "lucide-react"
import { ConfirmDeleteBalanceDialog } from "./confirm-delete-balance-dialog"
import { upsertCompleteBalanceSchema } from "@/schemas/completed-balance"
import { Prisma } from "@/utils/prisma"
import { upsertCompletedBalance } from "@/actions/upsert-completed-balance"
import { L10N_COMMON } from "@/l10n/l10n-common"

export function CompleteBalanceDialog({
  lang,
  id,
  updatingCompletedBalance,
}: {
  lang: Language
  id: string
  updatingCompletedBalance: Prisma.CompletedBalance | null
}) {
  const form = useForm<z.infer<typeof upsertCompleteBalanceSchema>>({
    resolver: zodResolver(upsertCompleteBalanceSchema),

    defaultValues: {
      id,
      public: updatingCompletedBalance?.public ?? false,
      success: updatingCompletedBalance?.success ?? false,
      partnerCompany: updatingCompletedBalance?.partnerCompany ?? "",
      comment: updatingCompletedBalance?.comment ?? "",
    },
  })

  const handleSubmit: SubmitHandler<
    z.infer<typeof upsertCompleteBalanceSchema>
  > = async (v) => {
    await upsertCompletedBalance(v)
    // TODO: Not idiomatic with Next.js
    location.reload()
  }

  return (
    <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{L10N_COMMON.complete[lang]}</DialogTitle>
          <DialogDescription>
            {L10N_COMMON.hereYouCanCompleteText[lang]}
          </DialogDescription>
          <HtmlForm onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="public"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {L10N_COMMON.partnerCompanyAndCommentCanBePublic[lang]}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="success"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {L10N_COMMON.theCompetenceSharingWasSuccessful[lang]}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            </div>
            <FormField
              control={form.control}
              name="partnerCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{L10N_COMMON.partnerCompany[lang]} ({L10N_COMMON.optional[lang]})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{L10N_COMMON.comment[lang]} ({L10N_COMMON.optional[lang]})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit">{L10N_COMMON.complete[lang]}</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" type="button">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    {L10N_COMMON.delete[lang]}
                  </Button>
                </DialogTrigger>
                <ConfirmDeleteBalanceDialog lang={lang} id={id} />
              </Dialog>
            </div>
          </HtmlForm>
        </DialogHeader>
      </Form>
    </DialogContent>
  )
}
