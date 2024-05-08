import * as prisma from "@prisma/client"

let p: prisma.PrismaClient | undefined = undefined
if (!p) {
  p = new prisma.PrismaClient()
}
const db = p!

export { db }
export * as DB from "@prisma/client"
