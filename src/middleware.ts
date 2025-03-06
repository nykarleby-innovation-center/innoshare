// middleware.js
import { NextRequest } from "next/server"
import { decodeUnverifiedSessionCookie } from "./utils/session"
import { Language } from "./types/language"
import Negotiator from "negotiator"
import { match } from "@formatjs/intl-localematcher"
import { languageSchema } from "./schemas/language"

const defaultLanguage: Language = "sv"

function getLocale(request: NextRequest): Language {
  let languages = new Negotiator({
    headers: Object.fromEntries(request.headers.entries()),
  }).languages()

  return match(languages, languageSchema.options, defaultLanguage) as Language
}

export async function middleware(request: NextRequest) {
  const unverifiedSession = await decodeUnverifiedSessionCookie()

  const { pathname } = request.nextUrl
  if (pathname === "/") return

  const pathnameHasLocale = languageSchema.options.find(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  const lang = pathnameHasLocale ?? getLocale(request)

  if (
    unverifiedSession?.userOnboarded === false &&
    pathname !== `/${lang}/user-settings`
  ) {
    request.nextUrl.pathname = `/${lang}/user-settings`
    request.nextUrl.searchParams.set("redirect", pathname)

    return Response.redirect(request.nextUrl)
  }

  if (pathnameHasLocale) return

  request.nextUrl.pathname = `/${lang}${pathname}`

  return Response.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    "/((?!api|images|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
