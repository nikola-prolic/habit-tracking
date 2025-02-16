import { PrismaClient, Entry } from '@prisma/client' // Import Entry type
import { defineEventHandler, getQuery, createError } from 'h3'
import { getServerSession } from '#auth' // Correct session import


const prisma = new PrismaClient()

export interface GetAllEntriesResponse {
    entries: Entry[];
    count: number
}
export interface EntryFilterRequest {
    habitId?: number;
    startDate?: string; // ISO date string (e.g., '2025-02-08')
    endDate?: string;   // ISO date string (e.g., '2025-02-08')
}


export default defineEventHandler(async (event) => {
    const resp: GetAllEntriesResponse = {} as GetAllEntriesResponse;
    const session = await getServerSession(event) // Use getServerSession
    const userId = session?.user?.id;

    if (!userId) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const query = getQuery<EntryFilterRequest>(event); // Use request type
    const habitIdFilter = query.habitId ? parseInt(String(query.habitId)) : undefined;
    const startDateFilter = query.startDate ? new Date(query.startDate) : undefined;
    const endDateFilter = query.endDate ? new Date(query.endDate) : undefined;

    const whereClause: any = {
        userId: userId,
    };

    if (habitIdFilter) {
        whereClause.habitId = habitIdFilter;
    }
    if (startDateFilter && endDateFilter) {
        whereClause.createdAt = {
            gte: startDateFilter,
            lte: endDateFilter,
        };
    } else if (startDateFilter) {
        whereClause.createdAt = {
            gte: startDateFilter,
        };
    } else if (endDateFilter) {
        whereClause.createdAt = {
            lte: endDateFilter,
        };
    }


    try {
        const entries = await prisma.entry.findMany({
            where: whereClause,
            include: {
                habit: true,
            }
        });
        Object.assign(resp, entries); // Update response object
        return resp;
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Could not fetch entries',
        })
    } finally {
        await prisma.$disconnect();
    }
})
