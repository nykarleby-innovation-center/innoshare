import { getSession } from "@auth0/nextjs-auth0"
import { AuthServiceImplementation } from "./auth-service"

export const Auth0AuthService: AuthServiceImplementation = {
  async getSessionUser() {
    const session = await getSession()

    if (!session) {
      return null
    }

    return {
      id: session.user.sub,
      email: session.user.email,
      name: session.user.name,
    }
  },
}
