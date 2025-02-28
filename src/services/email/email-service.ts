import { AzureEmailService } from "./azure-email-service"

export interface EmailService {
  sendEmail(args: {
    to: string
    toType?: "user" | "internal"
    subject: string
    message: string
    messageType?: "html" | "text"
  }): Promise<void>
  sendEmails(args: {
    to: string[]
    subject: string
    message: string
    messageType?: "html" | "text"
  }): Promise<void>
}

export const EmailService = AzureEmailService
