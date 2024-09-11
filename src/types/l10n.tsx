import { l10nTextSchema } from "@/schemas/l10n"
import { Language } from "./language"

export type L10nText = typeof l10nTextSchema._type

export type L10nTranslationStrings = Record<
  string,
  | Record<Language, string | string[]>
  | ((...args: any) => Record<Language, string | string[]>)
>
