import { L10N_COMMON } from "@/l10n/l10n-common"
import { L10nText } from "@/types/l10n"
import { Language } from "@/types/language"

export const LANGUAGE_NAMES_L10N = {
  en: L10N_COMMON.english,
  sv: L10N_COMMON.swedish,
  fi: L10N_COMMON.finnish,
} satisfies Record<Language, L10nText>

export const getPageWithoutLanguage = (pathname: string) =>
  pathname.split("/").slice(2).join("/")
