import { ENVIRONMENT } from "@/utils/env"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  cookies().delete("session")
  return Response.redirect(ENVIRONMENT.HOST)
}