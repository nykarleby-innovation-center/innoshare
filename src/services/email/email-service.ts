import { AzureEmailService } from "./azure-email-service"

export interface EmailService {
  sendEmail(args: {
    to: string
    toType?: "user" | "internal"
    subject: string
    message: string
  }): Promise<void>
}

export const EmailService = AzureEmailService
