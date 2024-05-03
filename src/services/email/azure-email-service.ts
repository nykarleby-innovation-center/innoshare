import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email"
import { EmailService } from "./email-service"
import { getEnv } from "@/utils/env"

// Pretty much taken directly from Microsoft's documentation
// https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email?tabs=windows%2Cazurekeycredential&pivots=programming-language-javascript
// Why do they overcomplicate it with a poller? I have no idea.
// I just want to send an email.
//
// @FrankSandqvist

const POLLER_WAIT_S = 2

export const AzureEmailService: EmailService = {
  async sendEmail({ to, subject, message }) {
    const connectionString = getEnv("AZURE_EMAIL_CONNECTION_STRING")
    if (!connectionString) {
      throw new Error("Azure email connection string not set")
    }

    const emailClient = new EmailClient(connectionString)

    const senderAddress = getEnv("EMAIL_SENDER_ADDRESS")
    if (!senderAddress) {
      throw new Error("Email sender address not set")
    }

    try {
      const poller = await emailClient.beginSend({
        senderAddress,
        recipients: {
          to: [{ address: to }],
        },
        content: { subject, plainText: message },
      })

      if (!poller.getOperationState().isStarted) {
        throw new Error("Poller was not started.")
      }

      let timeElapsed = 0
      while (!poller.isDone()) {
        poller.poll()

        await new Promise((resolve) =>
          setTimeout(resolve, POLLER_WAIT_S * 1000)
        )
        timeElapsed += POLLER_WAIT_S

        if (timeElapsed > 10 * POLLER_WAIT_S) {
          throw new Error("Polling timed out after 10 tries.")
        }
      }

      const result = poller.getResult()

      if (result?.status !== KnownEmailSendStatus.Succeeded) {
        console.error("Email send failed")
        if (result?.error) {
          throw result.error
        }
      }
    } catch (e) {
      console.error(e)
    }
  },
}
