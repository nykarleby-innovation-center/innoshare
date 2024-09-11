// middleware.js
import { NextRequest, NextResponse } from "next/server"
import { decodeUnverifiedSessionCookie } from "./utils/session"
import { ENVIRONMENT } from "./utils/env"
import { Language } from "./types/language"

export function middleware(request: NextRequest) {
  const unverifiedSession = decodeUnverifiedSessionCookie()

  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")

  let lang: Language = "en"
  if (origin && referer) {
    const path = referer.replace(origin, "")
    lang = path.split("/")[1] as Language
  }

  if (
    unverifiedSession?.userOnboarded === false &&
    request.nextUrl.pathname !== `/${lang}/user-settings`
  ) {
    return NextResponse.redirect(
      new URL(`/${lang}/user-settings`, ENVIRONMENT.HOST)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
