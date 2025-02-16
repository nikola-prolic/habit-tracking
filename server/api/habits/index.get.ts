import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'
import { getServerSession } from "#auth"
import { HabitWithEntries } from '~/prisma/types';

const prisma = new PrismaClient()

export interface GetHabitsResponse {
    habits: HabitWithEntries[];
    count: number;
}
export interface HabitFilterObject {
    // You can add filter properties here if needed in the future | for now we keep it simple and return all habits
}

export default defineEventHandler(async (event) => {
    const resp: GetHabitsResponse = {} as GetHabitsResponse
    const session = await getServerSession(event)
    const userId = session?.user?.id;

    if (!userId) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    // const query = getQuery<HabitFilterObject>(event); // Example if you want to use filters later

    try {
        const habits = await prisma.habit.findMany({
            where: {
                userId: userId,
            },
            include: {
                entries: true,
            }
        })
        resp.habits = habits
        resp.count = habits.length
        return resp
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Could not fetch habits' })
    } finally {
        await prisma.$disconnect()
    }
})
