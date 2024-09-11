import { languageSchema } from "@/schemas/language"
import { translateTextSchema } from "@/schemas/translate"
import { AiService } from "@/services/ai/ai-service"
import { z } from "zod"

const LANGUAGE_MAP: Record<typeof languageSchema._type, string> = {
  sv: "Swedish",
  en: "English",
  fi: "Finnish",
}

export async function translate(data: typeof translateTextSchema._type) {
  const responseGenerator = AiService.jsonChatCompletion({
    messages: [
      {
        role: "user",
        text: `Please translate the following text from ${
          LANGUAGE_MAP[data.fromLanguage]
        } to languages ${data.toLanguages
          .map((l) => LANGUAGE_MAP[l])
          .join(
            ", "
          )}. Respond with a JSON object of with the keys ${data.toLanguages
          .map((l) => `"${l}"`)
          .join(", ")}. The following is the text to translate:
  
  ${data.text}`,
      },
    ],
  })

  let res
  for await (const chunk of responseGenerator) {
    if (typeof chunk !== "string") {
      res = chunk
    }
  }

  const translated = z
    .object({
      ...data.toLanguages.reduce((acc, l) => ({ ...acc, [l]: z.string() }), {}),
    })
    .safeParse(res)

  if (!translated.success) {
    return null
  }

  return translated.data
}
