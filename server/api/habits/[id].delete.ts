import { Habit, PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getServerSession } from "#auth"

const prisma = new PrismaClient()

export interface DeleteHabitResponse {
    message: string;
    habit: Habit
}

export default defineEventHandler(async (event) => {
    const resp: DeleteHabitResponse = {} as DeleteHabitResponse
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
        const habit = await prisma.habit.delete({
            where: {
                id: habitId,
                userId: userId, // Ensure habit belongs to the user
            },
        })
        resp.message = 'Habit deleted successfully'
        resp.habit = habit
        return resp
    } catch (error) {
        console.log("coulnd't detele stuff: ", error)
        throw createError({ statusCode: 500, message: 'Could not delete habit' })
    } finally {
        await prisma.$disconnect()
    }
})
