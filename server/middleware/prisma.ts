import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient

//@ts expect error
declare module 'h3' {
    interface H3EventContext {
        prisma: PrismaClient
    }
}

export default eventHandler(event => {
    if (!prisma) {
        prisma = new PrismaClient()
    }
    event.context.params = prisma
})
