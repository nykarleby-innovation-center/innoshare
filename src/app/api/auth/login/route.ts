import { getLoginUrl } from "@/utils/auth"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  const url = await getLoginUrl()
  return Response.redirect(url)
}

export const dynamic = "force-dynamic"
