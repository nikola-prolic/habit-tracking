import { NuxtAuthHandler } from "#auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const config = useRuntimeConfig()
const prisma = new PrismaClient()

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    secret: config.authSecret,
    adapter: PrismaAdapter(prisma),
    providers: [
        // @ts-expect-error Use .default here for it to work during SSR.
        GoogleProvider.default({
            clientId: config.public.googleAuthClientId,
            clientSecret: config.googleAuthClientSecret
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session?.user?.email) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: session.user.email,
                    },
                });
                if (user) {
                    session.user.id = user.id; // Add userId to session.user
                }
            }
            return session;
        },
    }
})
