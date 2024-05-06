type Environment = {
  EMAIL_FROM: string
  INTERNAL_NOTIFICATION_FROM: string
  INTERNAL_NOTIFICATION_TO: string
} & { AZURE_EMAIL_CONNECTION_STRING: string }

export const ENVIRONMENT = process.env as any as Environment
