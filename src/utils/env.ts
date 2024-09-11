import { OpenAiAiServiceVariables } from "@/services/ai/openai-ai-service"
import { AzureEmailServiceEnvironmentVariables } from "@/services/email/azure-email-service"
import { AzureStorageServiceEnvironmentVariables } from "@/services/storage/azure-storage-service"

type Environment = {
  HOST: string
  EMAIL_FROM: string
  INTERNAL_NOTIFICATION_FROM: string
  INTERNAL_NOTIFICATION_TO: string
  OPENID_DOMAIN: string
  OPENID_CLIENT_ID: string
  OPENID_CLIENT_SECRET: string
  SESSION_SECRET: string
} & AzureEmailServiceEnvironmentVariables &
  AzureStorageServiceEnvironmentVariables &
  OpenAiAiServiceVariables

export const ENVIRONMENT = process.env as any as Environment
