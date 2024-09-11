import React from "react"
import { FormControl, FormField } from "../ui/form"
import { languageSchema } from "../../schemas/language"
import { Language } from "../../types/language"
import { UseFormReturn } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import { Toggle } from "../ui/toggle"
import { Languages, Loader2 } from "lucide-react"
import { LANGUAGE_NAMES_L10N } from "@/utils/language"

export function AutoTranslatingFormTextboxes({
  lang,
  l10nFieldName,
  form,
  autoTranslateLanguages,
  autoTranslatingLanguages,
  onToggleAutoTranslate,
}: {
  lang: Language
  l10nFieldName: string
  form: UseFormReturn<any>
  autoTranslateLanguages: Language[]
  autoTranslatingLanguages: Language[]
  onToggleAutoTranslate: (lang: Language) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {languageSchema.options.map((ln, i) => (
        <FormField
          key={ln}
          control={form.control}
          name={`${l10nFieldName}.${ln}`}
          render={({ field }) => (
            <FormControl
              style={{
                order: ln === lang ? 0 : i + 1,
              }}
            >
              <div className="flex gap-2 items-start">
                <Textarea
                  {...field}
                  placeholder={LANGUAGE_NAMES_L10N[ln][lang]}
                  disabled={autoTranslatingLanguages.includes(ln)}
                  className="duration-300 max-h-32 focus:min-h-32 focus:max-h-96"
                  style={{ fieldSizing: "content" } as any}
                />
                <Toggle
                  size="sm"
                  pressed={autoTranslateLanguages.includes(ln)}
                  onPressedChange={() => onToggleAutoTranslate(ln)}
                  disabled={autoTranslatingLanguages.includes(ln)}
                >
                  {autoTranslatingLanguages.includes(ln) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Languages className="w-4 h-4" />
                  )}
                </Toggle>
              </div>
            </FormControl>
          )}
        />
      ))}
    </div>
  )
}
