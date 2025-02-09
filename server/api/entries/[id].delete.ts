import { Entry, PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getServerSession } from '#auth' // Correct session import


const prisma = new PrismaClient()

export interface DeleteEntryResponse { message: string, entry: Entry } // Define response type


export default defineEventHandler(async (event) => {
    const session = await getServerSession(event) // Use getServerSession
    const userId = session?.user?.id;

    if (!userId) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const id = getRouterParam(event, 'id')
    const entryId = id ? parseInt(id) : undefined;
    if (!entryId) {
        throw createError({ statusCode: 400, message: 'Entry ID is required' })
    }

    const resp: DeleteEntryResponse = {} as DeleteEntryResponse; // Initialize response object


    try {
        const entry = await prisma.entry.delete({
            where: {
                id: entryId,
                userId: userId, // Ensure entry belongs to the user
            },
        })
        Object.assign(resp, { message: 'Entry deleted successfully', entry: entry }); // Update response object
        return resp;
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Could not delete entry',
        })
    } finally {
        await prisma.$disconnect()
    }
})
