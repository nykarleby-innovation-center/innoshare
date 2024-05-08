import { AuthService } from "@/services/auth/auth-service"
import {
  AfterCallbackAppRoute,
  handleAuth,
  handleCallback,
} from "@auth0/nextjs-auth0"

const afterCallback: AfterCallbackAppRoute = async (req, session) => {
  console.log(session)

  await AuthService.upsertDatabaseUser({
    id: session.user.sub,
    email: session.user.email,
    name: session.user.name,
  })
  return session
}

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
})
