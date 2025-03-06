"use client"

import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { interestFormSchema } from "../../schemas/interest-form"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Language } from "@/types/language"
import { updateInterest } from "@/actions/upsert-interest"
import { Interest } from "@prisma/client"
import { HtmlForm } from "../server/html-form"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function UpsertInterestForm({
  interest,
  lang,
  onSubmit,
  redirectAfter,
}: {
  interest: Omit<Interest, "id"> | null
  lang: Language
  onSubmit?: () => any
  redirectAfter: string | null
}) {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const form = useForm<z.infer<typeof interestFormSchema>>({
    resolver: zodResolver(interestFormSchema),

    defaultValues: {
      name: interest?.name ?? "",
      company: interest?.company ?? "",
      email: interest?.email ?? "",
      privacyPolicyAccepted: false,
      acceptDigest: interest?.receiveDigest,
      acceptNewsletter: interest?.receiveNewsletter,
      language: lang,
    },
  })

  const handleSubmit = async (values: z.infer<typeof interestFormSchema>) => {
    if (!interest && !values.acceptDigest && !values.acceptNewsletter) {
      form.setError("acceptDigest", {
        type: "manual",
        message: "Välj åtminstone ett alternativ för våra mail.",
      })
      form.setError("acceptNewsletter", {
        type: "manual",
        message: "Välj åtminstone ett alternativ för våra mail.",
      })
      return
    }

    try {
      setLoading(true)
      const res = await updateInterest({
        email: values.email,
        name: values.name,
        company: values.company,
        receiveNewsletter: values.acceptNewsletter,
        receiveDigest: values.acceptDigest,
        language: lang,
      })
      if (!res.success) {
        throw new Error("Failed to submit interest")
      }

      if (onSubmit) {
        onSubmit()
      } else {
        toast({ title: "Intresse uppdaterat!" })

        if (redirectAfter) {
          router.push(redirectAfter)
        }
      }
    } catch (_) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <HtmlForm onSubmit={form.handleSubmit(handleSubmit)}>
        {!interest && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {L10N_COMMON.name[lang]}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {L10N_COMMON.company[lang]}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="email"
          disabled={!!interest?.email}
          render={({ field }) => (
            <FormItem>
              <FormLabel> {L10N_COMMON.email[lang]}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="rounded-md border">
          <FormField
            control={form.control}
            name="privacyPolicyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {L10N_COMMON.iHaveReadPrivacyPolicy[lang][0]}{" "}
                    <a
                      className="underline"
                      href="https://net.centria.fi/en/centria/data-protection/"
                    >
                      {L10N_COMMON.iHaveReadPrivacyPolicy[lang][1]}
                    </a>{" "}
                    {L10N_COMMON.iHaveReadPrivacyPolicy[lang][2]}{" "}
                    <a
                      className="underline"
                      href="https://nykarlebyinnovationcenter.fi/privacy-policy"
                    >
                      {L10N_COMMON.iHaveReadPrivacyPolicy[lang][3]}
                    </a>{" "}
                    {L10N_COMMON.iHaveReadPrivacyPolicy[lang][4]}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptDigest"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    <div className="font-bold">InnoShare Weekly</div>
                    <div>{L10N_COMMON.innoshareWeeklyDescription[lang]}</div>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptNewsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    <div className="font-bold">
                      {L10N_COMMON.newsletter[lang]}
                    </div>
                    <div>{L10N_COMMON.newsletterDescription[lang]}</div>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        {error && (
          <div>
            {L10N_COMMON.interestErrorText[lang]}{" "}
            <a href="mailto:info@innoshare.fi" className="underline">
              info@innoshare.fi
            </a>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading && (
            <span className="mr-2">
              <Loader2 className="animate-spin" />
            </span>
          )}
          {error
            ? L10N_COMMON.tryAgain[lang]
            : interest
            ? L10N_COMMON.update[lang]
            : L10N_COMMON.submit[lang]}
        </Button>
      </HtmlForm>
    </Form>
  )
}
