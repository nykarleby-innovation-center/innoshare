import { AzureEmailService } from "./azure-email-service"

export interface EmailService {
  sendEmail(args: {
    to: string
    subject: string
    message: string
  }): Promise<void>
}

export const EmailService = AzureEmailService
