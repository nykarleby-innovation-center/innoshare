import OpenAI from "openai"
import { AiService } from "./ai-service"
import { ENVIRONMENT } from "@/utils/env"

export type OpenAiAiServiceVariables = {
  OPENAI_API_KEY: string
}

export const OpenAiAiService: AiService = {
  //async analyzeImage({ image, prompt }) {
  //  const openai = new OpenAI({
  //    apiKey: ENVIRONMENT.OPENAI_API_KEY,
  //  })
  //
  //  console.log(image.toString("base64"))
  //  const aiRes: OpenAI.Chat.Completions.ChatCompletion =
  //    await openai.chat.completions.create({
  //      model: "gpt-4o",
  //      messages: [
  //        {
  //          role: "user",
  //          content: [
  //            {
  //              type: "image_url",
  //              image_url: {
  //                detail: "high",
  //                url: `data:image/png;base64,${image.toString("base64")}`,
  //              },
  //            },
  //            {
  //              type: "text",
  //              text: prompt,
  //            },
  //          ],
  //        },
  //      ],
  //      max_tokens: 100,
  //    })
  //
  //  return aiRes.choices[0].message.content!
  //},
  jsonChatCompletion: async function* ({ systemMessage, messages }) {
    const openai = new OpenAI({
      apiKey: ENVIRONMENT.OPENAI_API_KEY,
    })

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        ...(systemMessage
          ? [
              {
                role: "system",
                content: systemMessage,
              } as const,
            ]
          : []),
        ...messages.map((message) => {
          if (message.role === "user") {
            return {
              role: "user",
              content: [
                ...(message.image
                  ? ([
                      {
                        type: "image_url",
                        image_url: {
                          detail: "high",
                          url: `data:image/png;base64,${message.image.toString(
                            "base64"
                          )}`,
                        },
                      },
                    ] as const)
                  : []),
                {
                  type: "text",
                  text: message.text,
                },
              ],
            } satisfies OpenAI.Chat.Completions.ChatCompletionMessageParam
          }

          return {
            role: "assistant",
            content: message.text,
          } satisfies OpenAI.Chat.Completions.ChatCompletionMessageParam
        }),
      ],
      response_format: {
        type: "json_object",
      },
      stream: true,
    })

    let data = ""
    for await (const chunk of aiRes) {
      const content = chunk.choices[0].delta.content
      if (!content) continue

      data += content

      yield data
    }

    try {
      let json = JSON.parse(data)
      yield json
    } catch (error) {
      console.log("Error parsing JSON", error)
      console.log(data)
      return
    }
  },

  chatCompletion: async function* ({ systemMessage, messages }) {
    const openai = new OpenAI({
      apiKey: ENVIRONMENT.OPENAI_API_KEY,
    })

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        ...(systemMessage
          ? [
              {
                role: "system",
                content: systemMessage,
              } as const,
            ]
          : []),
        ...messages.map((message) => {
          if (message.role === "user") {
            return {
              role: "user",
              content: [
                ...(message.image
                  ? ([
                      {
                        type: "image_url",
                        image_url: {
                          detail: "high",
                          url: `data:image/png;base64,${message.image.toString(
                            "base64"
                          )}`,
                        },
                      },
                    ] as const)
                  : []),
                {
                  type: "text",
                  text: message.text,
                },
              ],
            } satisfies OpenAI.Chat.Completions.ChatCompletionMessageParam
          }

          return {
            role: "assistant",
            content: message.text,
          } satisfies OpenAI.Chat.Completions.ChatCompletionMessageParam
        }),
      ],
      stream: true,
    })

    let data = ""
    for await (const chunk of aiRes) {
      const content = chunk.choices[0].delta.content
      if (!content) continue

      data += content

      yield data
    }
  },

  generateImage: async function ({ prompt }) {
    const openai = new OpenAI({
      apiKey: ENVIRONMENT.OPENAI_API_KEY,
    })

    const aiRes = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      response_format: "b64_json"
    })

    return Buffer.from(aiRes.data[0].b64_json!, "base64")
  },
}
