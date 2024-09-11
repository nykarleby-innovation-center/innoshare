"use client"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Language } from "@/types/language"
import { SubmitHandler, useForm } from "react-hook-form"
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
import { updateUserFormSchema } from "@/schemas/user"
import { updateUser } from "@/actions/update-user"
import { User } from "@prisma/client"
import { HtmlForm } from "../server/html-form"
import { L10N_COMMON } from "@/l10n/l10n-common"

export function UpdateUserForm({ lang, user }: { lang: Language; user: User }) {
  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),

    defaultValues: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber ?? "",
    },
  })

  const handleSubmit: SubmitHandler<
    z.infer<typeof updateUserFormSchema>
  > = async (v) => {
    await updateUser(v)
  }

  return (
    <Form {...form}>
      <HtmlForm onSubmit={form.handleSubmit(handleSubmit)}>
        <input type="hidden" name="id" value={user.id} />
        <FormItem>
          <FormLabel>{L10N_COMMON.email[lang]}</FormLabel>
          <FormControl>
            <Input value={user.email} disabled />
          </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{L10N_COMMON.firstName[lang]}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{L10N_COMMON.lastName[lang]}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{L10N_COMMON.phoneNumber[lang]}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="items-start">
          {L10N_COMMON.update[lang]}
        </Button>
      </HtmlForm>
    </Form>
  )
}
