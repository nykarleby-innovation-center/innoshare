"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { interestFormSchema } from "../../schemas/interest-form";
import { L10N_COMMON } from "@/l10n/l10n-common";
import { Language } from "@/l10n/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function InterestFormDialog({ lang }: { lang: Language }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof interestFormSchema>>({
    resolver: zodResolver(interestFormSchema),

    defaultValues: {
      name: "",
      company: "",
      email: "",
      centriaPrivacyPolicyAccepted: false,
      nicPrivacyPolicyAccepted: false,
      acceptEmails: false,
      language: lang
    },
  });

  const handleSubmit = async (values: z.infer<typeof interestFormSchema>) => {
    try {
      setLoading(true);
      const res = await fetch("/api/interest", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.status !== 200) {
        throw new Error();
      }
      setSubmitted(true);
    } catch (_) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{L10N_COMMON.thankYou[lang]}</DialogTitle>
          <DialogDescription>
            {L10N_COMMON.weWillKeepYouUpdated[lang]}
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleReset}>{L10N_COMMON.submitAgain[lang]}</Button>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll">
      <DialogHeader>
        <DialogTitle> {L10N_COMMON.imInterested[lang]}</DialogTitle>
        <DialogDescription>
          {L10N_COMMON.interestSubmissionText[lang]}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          <FormField
            control={form.control}
            name="email"
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
              name="centriaPrivacyPolicyAccepted"
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
                      {L10N_COMMON.iHaveReadCentriasPrivacyPolicy[lang][0]}{" "}
                      <a
                        className="underline"
                        href="https://net.centria.fi/en/centria/data-protection/"
                      >
                        {L10N_COMMON.iHaveReadCentriasPrivacyPolicy[lang][1]}
                      </a>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nicPrivacyPolicyAccepted"
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
                      {L10N_COMMON.iHaveReadNicPrivacyPolicy[lang][0]}{" "}
                      <a
                        className="underline"
                        href="https://nykarlebyinnovationcenter.fi/privacy-policy"
                      >
                        {L10N_COMMON.iHaveReadNicPrivacyPolicy[lang][1]}
                      </a>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptEmails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{L10N_COMMON.iAcceptEmails[lang]}</FormLabel>
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
            {error ? L10N_COMMON.tryAgain[lang] : L10N_COMMON.submit[lang]}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
