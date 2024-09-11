"use client"

import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "../ui/button"
import {
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Slider } from "../ui/slider"
import { PageWrapper } from "../server/page-wrapper"
import { HtmlForm } from "../server/html-form"
import { PageHeader } from "../server/page-header"
import { cn } from "@/utils/ui"
import { Prisma } from "@/utils/prisma"
import { ComboBox } from "../ui/combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { DateRangePicker } from "../ui/date-range-picker"
import { createCompetences } from "@/actions/create-competences"
import { upsertBalanceFormSchema } from "@/schemas/balance"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useAutoTranslateFormFields } from "@/hooks/auto-translate-form-fields"
import { L10nText } from "@/types/l10n"
import { AutoTranslatingFormTextboxes } from "../server/auto-translating-form-textboxes"
import { updateBalance } from "@/actions/update-balance"
import { createBalance } from "@/actions/create-balance"
import { Language } from "@/types/language"
import { L10N_COMMON } from "@/l10n/l10n-common"

export function UpsertBalancePage({
  lang,
  organizations,
  competences,
  editingBalance,
}: {
  lang: Language
  organizations: Array<
    Pick<Prisma.Organization, "id" | "name"> & {
      regions: Array<Pick<Prisma.Region, "id" | "l10nName">>
    }
  >
  competences: Array<Pick<Prisma.Competence, "id" | "l10nName">>
  editingBalance: Pick<
    Prisma.Balance,
    | "id"
    | "l10nDescription"
    | "amount"
    | "startDate"
    | "endDate"
    | "competenceId"
    | "regionId"
    | "organizationId"
  > | null
}) {
  const [competencesAndNew, setCompetencesAndNew] =
    useState<typeof competences>(competences)

  const [mode, setMode] = useState<"need" | "supply" | null>(
    editingBalance?.amount
      ? editingBalance.amount > 1
        ? "supply"
        : "need"
      : null
  )

  const [includeDescription, setIncludeDescription] = useState(
    editingBalance?.l10nDescription ? true : false
  )

  const form = useForm<z.infer<typeof upsertBalanceFormSchema>>({
    resolver: zodResolver(upsertBalanceFormSchema),

    defaultValues: {
      organizationId: editingBalance?.organizationId ?? organizations[0]?.id,
      regionId: editingBalance?.regionId,
      competenceId: editingBalance?.competenceId,
      amount: editingBalance ? Math.abs(editingBalance.amount) : 1,
      l10nDescription: (editingBalance?.l10nDescription as L10nText) ?? null,
      dateRange: editingBalance
        ? [+editingBalance.startDate, +editingBalance.endDate]
        : undefined,
    },
  })
  const {
    setAutoTranslateLanguages: setAutoTranslateDescription,
    autoTranslateLanguages: autoTranslateDescriptionLanguages,
    autoTranslating: autoTranslatingDescription,
  } = useAutoTranslateFormFields({
    form,
    l10nFieldName: "l10nDescription",
  })

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name !== "organizationId") return
      form.resetField("regionId")
    })

    return () => subscription.unsubscribe()
  }, [form.watch, form.resetField])

  const handleSubmit: SubmitHandler<
    z.infer<typeof upsertBalanceFormSchema>
  > = async (v) => {
    if (editingBalance) {
      await updateBalance({ id: editingBalance.id, ...v })
    } else {
      await createBalance(v)
    }
  }

  return (
    <PageWrapper
      breadcrumb={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/balance/`}>
                {L10N_COMMON.competenceBalance[lang]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {editingBalance ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/${lang}/balance/` + editingBalance.id}
                  >
                    {
                      (
                        competences.find(
                          (c) => c.id === editingBalance.competenceId
                        )!.l10nName as L10nText
                      )[lang]
                    }
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      }
      header={
        <PageHeader className="w-full flex flex-col sm:block">
          {L10N_COMMON.newCompetenceBalanceDynamic[lang][0]}
          <span className="relative">
            <span
              className={cn(
                "absolute inline-flex text-orange-400 duration-200 sm:whitespace-pre",
                mode === "need"
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-5 opacity-0 pointer-events-none"
              )}
            >
              {L10N_COMMON.newCompetenceBalanceDynamic[lang][2]}
              <Button size="icon" variant="outline" className="ml-4 h-9 w-9 ">
                <ChevronsRightLeftIcon
                  onClick={() => {
                    setMode(mode === "need" ? "supply" : "need")
                  }}
                />
              </Button>
            </span>
            <span
              className={cn(
                "absolute inline-flex text-teal-400 duration-200 sm:whitespace-pre",
                mode === "supply"
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0 pointer-events-none"
              )}
            >
              {L10N_COMMON.newCompetenceBalanceDynamic[lang][1]}
              <Button size="icon" variant="outline" className="ml-4 h-9 w-9 ">
                <ChevronsLeftRightIcon
                  onClick={() => {
                    setMode(mode === "need" ? "supply" : "need")
                  }}
                />
              </Button>
            </span>
            <span
              className={cn(
                "absolute duration-200",
                mode === null ? "opacity-100" : "opacity-0"
              )}
            >
              {L10N_COMMON.newCompetenceBalanceDynamic[lang][3]}
            </span>
          </span>
        </PageHeader>
      }
    >
      {mode === null && (
        <>
          <div className="mb-8">
            {L10N_COMMON.areYouInNeedOrSupplyText[lang]}
          </div>
          <div className="flex flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              className={`border-2 border-orange-400 flex-col items-start h-24`}
              onClick={() => setMode("need")}
            >
              <div className="uppercase font-black text-lg flex flex-row items-center">
                <ChevronsRightLeftIcon className="mr-2 h-5 w-5 text-orange-700 dark:text-orange-400" />
                {L10N_COMMON.need[lang]}
              </div>
              {L10N_COMMON.weNeedText[lang]}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`border-2 border-teal-400 flex-col items-start h-24`}
              onClick={() => setMode("supply")}
            >
              <div className="uppercase font-black text-lg flex flex-row items-center">
                <ChevronsLeftRightIcon className="mr-2 h-5 w-5 text-teal-700 dark:text-teal-400" />
                {L10N_COMMON.supply[lang]}
              </div>
              {L10N_COMMON.weSupplyText[lang]}
            </Button>
          </div>
        </>
      )}
      {mode !== null && (
        <Form {...form}>
          <HtmlForm onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{L10N_COMMON.organization[lang]}</FormLabel>
                    <FormControl>
                      <Select
                        disabled={editingBalance !== null}
                        defaultValue={field.value}
                        onValueChange={(v) =>
                          form.setValue("organizationId", v)
                        }
                        {...field}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Organisation" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={(v) => {
                        console.log(v)
                        form.setValue("regionId", v)
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      {...field}
                    >
                      {organizations
                        .find((o) => o.id === form.getValues().organizationId)!
                        .regions.map((r) => (
                          <FormItem
                            key={r.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={r.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {(r.l10nName as L10nText)[lang]}
                            </FormLabel>
                          </FormItem>
                        ))}
                    </RadioGroup>
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="competenceId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <input type="hidden" {...field} />
                    <FormLabel>
                      {mode === "need"
                        ? L10N_COMMON.whatCompetenceAreYouInNeedOf[lang]
                        : L10N_COMMON.whatCompetenceDoYouHaveToOffer[lang]}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-4 lg:flex-row">
                        <ComboBox
                          allowArbitraryValue={{
                            onPickArbitraryValue: async (value) => {
                              const res = await createCompetences([
                                {
                                  type: "untranslated",
                                  name: value,
                                  originalLanguage: lang,
                                },
                              ])

                              if (!res.createdCompetences) {
                                return
                              }

                              setCompetencesAndNew((c) => [
                                ...c,
                                res.createdCompetences[0],
                              ])
                              form.setValue(
                                "competenceId",
                                res.createdCompetences[0].id
                              )
                            },
                          }}
                          options={competencesAndNew.map((o) => ({
                            label: (o.l10nName as L10nText)[lang],
                            value: o.id,
                          }))}
                          selectedOptionValue={field.value ?? null}
                          onPickOptionValue={(v) =>
                            v && form.setValue("competenceId", v)
                          }
                          disabled={editingBalance !== null}
                        />
                        {includeDescription ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              form.setValue("l10nDescription", null)
                              setIncludeDescription(false)
                            }}
                          >
                            <XIcon className="mr-4 w-4 h-4" />
                            {L10N_COMMON.removeDescription[lang]}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIncludeDescription(true)}
                          >
                            <PlusIcon className="mr-4 w-4 h-4" />
                            {L10N_COMMON.addExtraDescription[lang]}
                          </Button>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              {includeDescription && (
                <FormItem>
                  <AutoTranslatingFormTextboxes
                    autoTranslateLanguages={autoTranslateDescriptionLanguages}
                    autoTranslatingLanguages={autoTranslatingDescription}
                    form={form}
                    l10nFieldName="l10nDescription"
                    onToggleAutoTranslate={(la) =>
                      setAutoTranslateDescription((t) =>
                        t.includes(la) ? t.filter((l) => la !== l) : [...t, la]
                      )
                    }
                    lang={lang}
                  />
                </FormItem>
              )}
            </div>
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="w-full">
                  <input type="hidden" {...field} value={field.value?.[0]} />
                  <input type="hidden" {...field} value={field.value?.[1]} />
                  <FormLabel>{L10N_COMMON.duringWhichTime[lang]}</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      lang={lang}
                      dateRange={
                        field.value
                          ? {
                              from: new Date(field.value[0]),
                              to: new Date(field.value[1]),
                            }
                          : null
                      }
                      onPickDateRange={(range) => {
                        form.setValue("dateRange", [
                          range.from
                            ? +range.from
                            : +range.to! - 30 * 24 * 60 * 60 * 1000,
                          range.to
                            ? +range.to
                            : +range.from! + 30 * 24 * 60 * 60 * 1000,
                        ])
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="">
                  <input
                    type="hidden"
                    {...field}
                    value={mode === "supply" ? field.value : -field.value}
                  />
                  <FormLabel>
                    {mode === "need"
                      ? L10N_COMMON.howManyDoYouNeed[lang]
                      : L10N_COMMON.howManyDoYouHaveToOffer[lang]}
                  </FormLabel>
                  <div className="flex flex-row gap-4 lg:w-1/2">
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(v) => form.setValue("amount", v[0])}
                        rangeClassName={cn(
                          "transition-colors duration-300",
                          mode === "need" ? "bg-orange-400" : "bg-teal-400"
                        )}
                      />
                    </FormControl>
                    <div className="text-lg font-black">{field.value}</div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={cn(
                "self-start duration-300",
                mode === "supply"
                  ? "bg-teal-500 dark:bg-teal-400"
                  : "bg-orange-500 dark:bg-orange-400"
              )}
            >
              {editingBalance
                ? L10N_COMMON.update[lang]
                : L10N_COMMON.create[lang]}
            </Button>
          </HtmlForm>
        </Form>
      )}
    </PageWrapper>
  )
}
