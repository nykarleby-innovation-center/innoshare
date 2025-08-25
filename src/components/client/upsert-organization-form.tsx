"use client"

import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { AutoTranslatingFormTextboxes } from "../server/auto-translating-form-textboxes"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Sparkles, XIcon } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Prisma } from "@/utils/prisma"
import Image from "next/image"
import { cn } from "@/utils/ui"
import { AiAnalyzer } from "./ai-analyzer"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import { useAutoTranslateFormFields } from "../../hooks/auto-translate-form-fields"
import { createCompetences } from "@/actions/create-competences"
import { createCompetencesSchema } from "@/schemas/competence"
import { upsertOrganizationFormSchema } from "@/schemas/organization"
import { createOrganization } from "@/actions/create-organization"
import { updateOrganization } from "@/actions/update-organization"
import { Language } from "@/types/language"
import { HtmlForm } from "../server/html-form"
import { CompetenceCombobox } from "./competence-combobox"
import { useToast } from "@/hooks/use-toast"

export function UpsertOrganizationForm({
  lang,
  editingOrganization,
  regions,
  competences,
}: {
  lang: Language
  editingOrganization:
    | (Pick<
        Prisma.Organization,
        "id" | "name" | "l10nDescription" | "website"
      > & {
        regionIds: string[]
        competenceIds: string[]
      })
    | null
  regions: Array<Pick<Prisma.Region, "id" | "l10nName">>
  competences: Array<Pick<Prisma.Competence, "id" | "l10nName">>
}) {
  const { toast } = useToast()

  const [competencesAndNew, setCompetencesAndNew] =
    useState<typeof competences>(competences)

  const [aiAnalyzeActive, setAiAnalyzeActive] = useState(false)

  const form = useForm<z.infer<typeof upsertOrganizationFormSchema>>({
    resolver: zodResolver(upsertOrganizationFormSchema),

    defaultValues: {
      name: editingOrganization?.name ?? "",
      l10nDescription: (editingOrganization?.l10nDescription as any) ?? {
        sv: "",
        fi: "",
        en: "",
      },
      regionIds: editingOrganization?.regionIds ?? [],
      competenceIds: editingOrganization?.competenceIds ?? [],
      website: editingOrganization?.website ?? "https://",
    },
  })

  const {
    translate: translateDescription,
    setAutoTranslateLanguages: setAutoTranslateDescription,
    autoTranslateLanguages: autoTranslateDescriptionLanguages,
    autoTranslating: autoTranslatingDescription,
  } = useAutoTranslateFormFields({
    form,
    l10nFieldName: "l10nDescription",
  })

  const addCompetences = async (data: typeof createCompetencesSchema._type) => {
    const res = await createCompetences(data)

    if (res.createdCompetences) {
      setCompetencesAndNew((c) => [...c, ...res.createdCompetences])

      form.setValue("competenceIds", [
        ...form.getValues().competenceIds,
        ...res.createdCompetences.map((c) => c.id),
      ])
    }
  }

  const handleSubmit: SubmitHandler<
    z.infer<typeof upsertOrganizationFormSchema>
  > = async (v) => {
    if (editingOrganization) {
      await updateOrganization({ id: editingOrganization.id, ...v })
      toast({
        title: L10N_COMMON.organizationUpdated[lang],
      })
    } else {
      await createOrganization(v)
      toast({
        title: L10N_COMMON.organizationCreated[lang],
      })
    }
  }

  return (
    <>
      {aiAnalyzeActive && (
        <AiAnalyzer
          website={form.getValues().website}
          lang={lang}
          availableRegions={regions}
          onClose={() => setAiAnalyzeActive(false)}
          onDone={(data) => {
            form.setValue("website", data.website)

            if (data.companyName) {
              form.setValue("name", data.companyName)
            }
            form.setValue("regionIds", data.regionIds)
            form.setValue(`l10nDescription.${lang}`, data.description)
            translateDescription(data.description, lang)

            setAiAnalyzeActive(false)

            addCompetences(
              data.competences.map((c) => ({
                type: "untranslated",
                name: c,
                originalLanguage: lang,
              }))
            )
          }}
        />
      )}
      <Form {...form}>
        {/*<ArbeitButton
          className="absolute top-0 right-0 hidden lg:block"
          onClick={() => setAiAnalyzeActive(true)}
          lang={lang}
        />*/}
        <HtmlForm onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{L10N_COMMON.name[lang]}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{L10N_COMMON.website[lang]}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>{L10N_COMMON.yourOperations[lang]}</FormLabel>
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
            <FormMessage />
          </FormItem>
          <FormItem>
            <div className="mb-4">
              <FormLabel>{L10N_COMMON.regions[lang]}</FormLabel>
              <FormDescription>
                {L10N_COMMON.whichRegionsOperateText[lang]}
              </FormDescription>
            </div>
            {regions.map((r) => (
              <FormField
                key={r.id}
                control={form.control}
                name="regionIds"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={r.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          name="regionIds"
                          value={r.id}
                          checked={field.value?.includes(r.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, r.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== r.id)
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {(r.l10nName as any)[lang]}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="competenceIds"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{L10N_COMMON.competences[lang]}</FormLabel>
                  <FormDescription>
                    {L10N_COMMON.whichCompetencesRelevantText[lang]}
                  </FormDescription>
                </div>
                <Card>
                  <CardContent className="mt-4">
                    {field.value.length > 0 ? (
                      <div className="flex flex-row flex-wrap gap-2">
                        {field.value.map((c) => {
                          const competence = competencesAndNew.find(
                            (cc) => cc.id === c
                          )

                          if (!competence) {
                            return null
                          }

                          return (
                            <Badge
                              key={c}
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((v) => v !== c)
                                )
                              }
                            >
                              <input
                                type="hidden"
                                name="competenceIds"
                                value={competence.id}
                              />
                              {(competence.l10nName as any)[lang]}
                              <XIcon className="w-4 h-4" />
                            </Badge>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        {L10N_COMMON.addCompetencesBelow[lang]}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <CompetenceCombobox
                      lang={lang}
                      onPickCompetence={(competenceId, newlyCreated) => {
                        field.onChange([...field.value, competenceId])
                        if (newlyCreated) {
                          setCompetencesAndNew((c) => [...c, newlyCreated])
                        }
                      }}
                      competences={competencesAndNew.filter(
                        (c) => !field.value.includes(c.id)
                      )}
                    />
                  </CardFooter>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="self-start">
            {editingOrganization
              ? L10N_COMMON.update[lang]
              : L10N_COMMON.create[lang]}
          </Button>
        </HtmlForm>
      </Form>
    </>
  )
}

function ArbeitButton(
  props: { className?: string; lang: Language } & React.ComponentProps<"button">
) {
  const [mouseDown, setMouseDown] = useState(false)

  return (
    <button
      {...props}
      className={cn(
        `bg-gradient-to-br from-teal-600 to-orange-500 p-px rounded-[10px] relative duration-300 group cursor-pointer ${
          mouseDown ? "scale-95" : `hover:scale-105`
        }`,
        props.className
      )}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
    >
      <div className="relative bg-background p-[4px] z-20 rounded-[9px]">
        <div
          className={`relative flex flex-col items-center gap-1 bg-gradient-to-br rounded-[5px] px-4 py-2 duration-300 ${
            mouseDown
              ? `from-teal-600/80 via-transparent to-orange-500/80`
              : `from-teal-600/30 via-transparent to-orange-500/30 group-hover:from-teal-600/50 group-hover:via-transparent group-hover:to-orange-500/50`
          }`}
        >
          <div className="flex flex-row gap-2 uppercase font-black tracking-tight text-xl duration-300 group-hover:drop-shadow-[0_0_2px_white]">
            <Sparkles />
            {L10N_COMMON.analyzeWith[props.lang]}
          </div>
          <div className="relative w-72 h-16">
            <Image
              alt="Arbeit"
              src="/images/arbeit-light.svg"
              fill
              className="opacity-0 duration-300 blur-sm group-hover:opacity-100"
            />
            <Image
              alt="Arbeit"
              className="dark:invisible"
              src="/images/arbeit-dark.svg"
              fill
            />
            <Image
              alt="Arbeit"
              className=" invisible dark:visible"
              src="/images/arbeit-light.svg"
              fill
            />
          </div>
        </div>
      </div>
      <div className="absolute z-10 top-0 right-0 left-0 bottom-0 opacity-0 translate-y-1 bg-gradient-to-br from-teal-600 to-orange-500 group-hover:opacity-80 duration-500 blur-md" />
    </button>
  )
}
