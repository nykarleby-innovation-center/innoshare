// A rudimentary IP-based rate liming middleware for our API routes.

// Is there no built-in Next type for this?

type Handler = (req: Request, res: Response) => Promise<Response> | Response

const globalRateLimitMap = new Map()

export const globalRateLimit = (handler: Handler): Handler => {
  return (req, res) => {
    const ip = req.headers.get("x-forwarded-for")
    const limit = 5
    const windowMs = 60 * 1000

    if (!globalRateLimitMap.has(ip)) {
      globalRateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      })
    }

    const ipData = globalRateLimitMap.get(ip)

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0
      ipData.lastReset = Date.now()
    }

    if (ipData.count >= limit) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    ipData.count += 1

    return handler(req, res)
  }
}
