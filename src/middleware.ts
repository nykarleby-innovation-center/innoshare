// middleware.js
import { NextRequest, NextResponse } from "next/server"
import { decodeUnverifiedSessionCookie } from "./utils/session"
import { ENVIRONMENT } from "./utils/env"

export function middleware(request: NextRequest) {
  const unverifiedSession = decodeUnverifiedSessionCookie()

  if (
    unverifiedSession?.userOnboarded === false &&
    request.nextUrl.pathname !== "/en/user-settings"
  ) {
    return NextResponse.redirect(new URL("/en/user-settings", ENVIRONMENT.HOST))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
