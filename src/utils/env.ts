import { OpenAiAiServiceVariables } from "@/services/ai/openai-ai-service"
import { AzureEmailServiceEnvironmentVariables } from "@/services/email/azure-email-service"
import { MailJetEmailServiceEnvironmentVariables } from "@/services/email/mailjet-email-service"
import { AzureStorageServiceEnvironmentVariables } from "@/services/storage/azure-storage-service"
import { VercelBlobStorageServiceEnvironmentVariables } from "@/services/storage/vercel-blob-storage-service"

type Environment = {
  HOST: string
  EMAIL_FROM: string
  INTERNAL_NOTIFICATION_FROM: string
  INTERNAL_NOTIFICATION_TO: string
  NOTIFICATIONS_REPLY_TO: string
  ENABLE_SEND_NOTIFICATIONS_TO_INTERNAL: string
  OPENID_DOMAIN: string
  OPENID_CLIENT_ID: string
  OPENID_CLIENT_SECRET: string
  SESSION_SECRET: string
  CRON_SECRET: string
} & AzureEmailServiceEnvironmentVariables &
  MailJetEmailServiceEnvironmentVariables &
  AzureStorageServiceEnvironmentVariables &
  VercelBlobStorageServiceEnvironmentVariables &
  OpenAiAiServiceVariables

export const ENVIRONMENT = process.env as any as Environment
