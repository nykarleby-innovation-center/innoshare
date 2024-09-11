import jsonwebtoken from "jsonwebtoken"
import { ENVIRONMENT } from "./env"
import { cookies } from "next/headers"

export interface AuthSession {
  userId: string
  userOnboarded: boolean
  firstName: string
  organizations: Array<{ id: string; name: string }>
  exp: number
}

export async function signSession(
  session: Omit<AuthSession, "exp"> & { exp?: number }
): Promise<string> {
  return jsonwebtoken.sign(
    session,
    ENVIRONMENT.SESSION_SECRET,
    session.exp
      ? undefined
      : {
          expiresIn: "2d",
        }
  )
}

export async function verifySession(
  token: string
): Promise<AuthSession & { exp: number }> {
  return jsonwebtoken.verify(token, ENVIRONMENT.SESSION_SECRET, {
    complete: true,
  }).payload as AuthSession & { exp: number }
}

export async function checkSessionCookie(): Promise<AuthSession | null> {
  const token = cookies().get("session")

  if (!token?.value) {
    return null
  }

  try {
    return await verifySession(token.value)
  } catch (e) {
    return null
  }
}

export function decodeUnverifiedSessionCookie(): AuthSession | null {
  const token = cookies().get("session")

  if (!token?.value) {
    return null
  }

  try {
    return jsonwebtoken.decode(token.value) as AuthSession
  } catch (e) {
    return null
  }
}
