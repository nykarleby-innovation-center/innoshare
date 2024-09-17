import { createCompetences } from "@/actions/create-competences"
import { ComboBox } from "../ui/combobox"
import { Language } from "@/types/language"
import { L10nText } from "@/types/l10n"
import { Prisma } from "@/utils/prisma"

export function CompetenceCombobox({
  lang,
  selectedCompetence,
  onPickCompetence,
  competences,
  disabled,
}: {
  lang: Language
  selectedCompetence?: string
  onPickCompetence: (competenceId: string, newlyCreated?: Pick<Prisma.Competence, "id" | "l10nName">) => void
  competences: Array<Pick<Prisma.Competence, "id" | "l10nName">>
  disabled?: boolean
}) {
  return (
    <ComboBox
      allowArbitraryValue={{
        onPickArbitraryValue: async (value) => {
          const res = await createCompetences([
            {
              type: "untranslated",
              name: value,
              originalLanguage: lang,
            },
          ])

          if (!res.createdCompetences) {
            return
          }

          onPickCompetence(res.createdCompetences[0].id, res.createdCompetences[0])
        },
      }}
      options={competences.map((o) => ({
        label: (o.l10nName as L10nText)[lang],
        value: o.id,
      }))}
      selectedOptionValue={selectedCompetence ?? null}
      onPickOptionValue={(v) => v && onPickCompetence(v)}
      disabled={disabled}
      lang={lang}
    />
  )
}
