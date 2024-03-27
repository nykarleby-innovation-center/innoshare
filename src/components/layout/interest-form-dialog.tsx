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

export function InterestFormDialog({ lang }: { lang: Language }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof interestFormSchema>>({
    resolver: zodResolver(interestFormSchema),

    defaultValues: {
      name: "",
      company: "",
      email: "",
      centriaPrivacyPolicyAccepted: false,
      nicPrivacyPolicyAccepted: false,
      acceptEmails: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof interestFormSchema>) {
    fetch("/api/interest", { method: "POST", body: JSON.stringify(values) });
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle> {L10N_COMMON.imInterested[lang]}</DialogTitle>
        <DialogDescription>
          {L10N_COMMON.interestSubmissionText[lang]}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">Anmäl</Button>
        </form>
      </Form>
    </DialogContent>
  );
}
