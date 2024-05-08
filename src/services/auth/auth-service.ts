import { Auth0AuthService } from "./auth0-auth-service"
import { db } from "@/utils/prisma"

export interface AuthServiceBase {
  upsertDatabaseUser(user: AuthUser): Promise<void>
}

export interface AuthServiceImplementation {
  getSessionUser(): Promise<AuthUser | null>
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export const AuthServiceBase: AuthServiceBase = {
  async upsertDatabaseUser(authUser) {
    const user = await db.user.findFirst({
      where: { authServiceId: authUser.id },
    })

    if (!user) {
      await db.user.create({
        data: {
          authServiceId: authUser.id,
          email: authUser.email,
          name: authUser.name,
          organization: {
            create: {
              name: authUser.email,
            },
          },
        },
      })
    }
  },
}

export const AuthService: AuthServiceBase & AuthServiceImplementation = {
  ...AuthServiceBase,
  ...Auth0AuthService,
}
