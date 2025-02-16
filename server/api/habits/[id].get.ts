import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, getSession, createError } from 'h3'
import { getServerSession } from '#auth'
import { HabitWithEntries } from '~/prisma/types'

const prisma = new PrismaClient()
export interface GetHabitByIdResp {
    habit: HabitWithEntries
}

export default defineEventHandler(async (event) => {
    const resp: GetHabitByIdResp = {} as GetHabitByIdResp
    const session = await getServerSession(event)
    const userId = session?.user?.id;

    if (!userId) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const id = getRouterParam(event, 'id')
    const habitId = id ? parseInt(id) : undefined;

    if (!habitId) {
        throw createError({ statusCode: 400, message: 'Habit ID is required' })
    }

    try {
        const habit = await prisma.habit.findUnique({
            where: {
                id: habitId,
                userId: userId, // Ensure habit belongs to the user
            },
            include: {
                entries: true,
            }
        })

        if (!habit) {
            throw createError({ statusCode: 404, message: 'Habit not found' })
        }

        resp.habit = habit
        return resp
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Could not fetch habit' })
    } finally {
        await prisma.$disconnect()
    }
})
