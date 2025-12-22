import { EmailService } from "./email-service"
import { ENVIRONMENT } from "@/utils/env"
import MailJet from "node-mailjet"

export type MailJetEmailServiceEnvironmentVariables = {
  MAILJET_API_KEY: string
  MAILJET_SECRET_KEY: string
}

export const MailJetEmailService: EmailService = {
  async sendEmail({
    to,
    toType = "user",
    subject,
    message,
    messageType = "text",
  }) {
    const apiKey = ENVIRONMENT.MAILJET_API_KEY
    const secretKey = ENVIRONMENT.MAILJET_SECRET_KEY
    if (!apiKey || !secretKey) {
      throw new Error("MailJet API credentials not set")
    }

    const mailjet = new MailJet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    })

    const senderAddress =
      toType === "user"
        ? ENVIRONMENT.EMAIL_FROM
        : ENVIRONMENT.INTERNAL_NOTIFICATION_FROM
    if (!senderAddress) {
      throw new Error("Email sender address not set")
    }

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: senderAddress,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          TextPart: messageType === "text" ? message : undefined,
          HTMLPart: messageType === "html" ? message : undefined,
        },
      ],
    })
  },
  async sendMultipleEmails({ emails }) {
    const apiKey = ENVIRONMENT.MAILJET_API_KEY
    const secretKey = ENVIRONMENT.MAILJET_SECRET_KEY
    if (!apiKey || !secretKey) {
      throw new Error("MailJet API credentials not set")
    }

    const mailjet = new MailJet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    })

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        ...emails.map((email) => ({
          From: {
            Email: ENVIRONMENT.INTERNAL_NOTIFICATION_FROM,
          },
          To: [
            {
              Email: email.to,
            },
          ],
          Subject: email.subject,
          TextPart: email.messageType === "text" ? email.message : undefined,
          HTMLPart: email.messageType === "html" ? email.message : undefined,
        })),
      ],
    })
  },
}
