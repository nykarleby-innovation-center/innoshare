import { ENVIRONMENT } from "@/utils/env"
import { Client, Issuer } from "openid-client"

export type AuthServiceEnvironmentVariables = {}

let ISSUER: Issuer | null = null
let CLIENT: Client | null = null

const getIssuer = async () => {
  if (!ISSUER) {
    ISSUER = await Issuer.discover(ENVIRONMENT.OPENID_DOMAIN)
  }
  return ISSUER
}

const CALLBACK_URL = ENVIRONMENT.HOST + "/api/auth/callback"

const getClient = async () => {
  const issuer = await getIssuer()
  if (!CLIENT) {
    CLIENT = new issuer.Client({
      client_id: ENVIRONMENT.OPENID_CLIENT_ID,
      client_secret: ENVIRONMENT.OPENID_CLIENT_SECRET,
      redirect_uris: [CALLBACK_URL],
      response_types: ["code"],
    })
  }
  return CLIENT
}

export async function getLoginUrl() {
  const client = await getClient()
  const url = client.authorizationUrl({
    scope: "openid email profile",
    redirect_uri: CALLBACK_URL,
  })
  return url
}

export async function getAccessToken(code: string) {
  const client = await getClient()
  const tokenSet = await client.callback(CALLBACK_URL, { code })

  if (!tokenSet.access_token || !tokenSet.expires_at) return null

  return {
    accessToken: tokenSet?.access_token,
    expiresAt: tokenSet?.expires_at,
  }
}

export async function getUserInfo(accessToken: string) {
  const client = await getClient()
  const userInfo = await client.userinfo(accessToken)

  return userInfo
}
