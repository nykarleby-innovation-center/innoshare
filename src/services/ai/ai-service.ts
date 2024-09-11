import { OpenAiAiService } from "./openai-ai-service"

export interface AiService {
  // analyzeImage(args: { image: Buffer; prompt: string }): Promise<string>
  // generateJson<T>(args: { prompt: string, image?: Buffer }): Promise<T>
  jsonChatCompletion<T = any>(args: {
    systemMessage?: string
    messages: Array<
      | { role: "user"; text: string; image?: Buffer }
      | { role: "assistant"; text: string }
    >
  }): AsyncGenerator<string | T>

  chatCompletion<T>(args: {
    systemMessage?: string
    messages: Array<
      | { role: "user"; text: string; image?: Buffer }
      | { role: "assistant"; text: string }
    >
  }): AsyncGenerator<string>

  generateImage(args: { prompt: string }): Promise<Buffer>
}

export const AiService = OpenAiAiService
