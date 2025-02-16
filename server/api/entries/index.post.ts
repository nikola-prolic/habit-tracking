import { PrismaClient, Entry } from '@prisma/client' // Import Entry type from Prisma
import { defineEventHandler, readBody, createError } from 'h3'
import { getServerSession } from '#auth' // Correct session import

const prisma = new PrismaClient()

export interface CreateEntryResponse extends Entry { } // Define response type
export interface CreateEntryRequest {
    habitId: number;
    note: string;
}

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event) // Use getServerSession
    const userId = session?.user?.id;

    if (!userId) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const body = await readBody<CreateEntryRequest>(event) // Use request type
    const habitId = String(body.habitId)
    const note = String(body.note)


    const resp: CreateEntryResponse = {} as CreateEntryResponse; // Initialize response object

    try {
        const entry = await prisma.entry.create({
            data: {
                habitId: habitId,
                userId: userId,
                note: note

            },
        })
        Object.assign(resp, entry); // Update response object
        return resp;
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Could not create entry',
        })
    } finally {
        await prisma.$disconnect()
    }
})
