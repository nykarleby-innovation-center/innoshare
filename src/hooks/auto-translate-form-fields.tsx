import { useEffect, useRef, useState } from "react"
import { Language } from "../types/language"
import { UseFormReturn } from "react-hook-form"
import { translateText } from "../actions/translate-text"
import { languageSchema } from "../schemas/language"

export const useAutoTranslateFormFields = ({
  form,
  l10nFieldName,
}: {
  form: UseFormReturn<any>
  l10nFieldName: string
}) => {
  const translationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [autoTranslating, setAutoTranslating] = useState<Language[]>([])
  const [autoTranslateLanguages, setAutoTranslateLanguages] = useState<
    Language[]
  >(languageSchema.options)

  const translate = async (fromDescription: string, fromLang: Language) => {
    const toLanguages = languageSchema.options.filter(
      (l) => l !== fromLang && autoTranslateLanguages.includes(l)
    )

    setAutoTranslating(toLanguages)

    translationTimer.current = setTimeout(() => {
      translateText({
        text: fromDescription,
        fromLanguage: fromLang,
        toLanguages: toLanguages,
      })
        .then((res) => {
          console.log(res.translation)
          if (!res.translation) {
            return
          }
          for (const l of toLanguages) {
            form.setValue(`${l10nFieldName}.${l}`, (res.translation as any)[l])
          }
        })
        .finally(() => {
          setAutoTranslating([])
        })
    }, 2000)
  }

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (!name || !type) return

      const descriptionChanged = languageSchema.options.find(
        (n) => `${l10nFieldName}.${n}` === name
      )

      if (descriptionChanged) {
        const fieldValue = value.l10nDescription![descriptionChanged]

        if (translationTimer.current) {
          clearTimeout(translationTimer.current)
        }

        if (!fieldValue) {
          setAutoTranslating([])
          return
        }

        translate(fieldValue, descriptionChanged)
      }
    })
    return () => subscription.unsubscribe()
  }, [l10nFieldName, form.watch, autoTranslateLanguages, translate])

  return {
    translate,
    setAutoTranslateLanguages,
    autoTranslateLanguages,
    autoTranslating,
  }
}
