"use client"

import { languageSchema } from "@/schemas/language"
import { Language } from "@/types/language"
import { getPageWithoutLanguage, LANGUAGE_NAMES_L10N } from "@/utils/language"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function FooterLanguageLinks({ lang }: { lang: Language }) {
  const pathname = usePathname()
  const link = getPageWithoutLanguage(pathname)

  return (
    <div className="flex flex-row items-center gap-4">
      {languageSchema.options
        .filter((l: Language) => l !== lang)
        .map((l: Language, i, arr) => (
          <>
            <Link href={`/${l}/${link}`} key={l}>
              {LANGUAGE_NAMES_L10N[l][l]}
            </Link>
            {i !== arr.length - 1 && <span className="opacity-50">|</span>}
          </>
        ))}
    </div>
  )
}
