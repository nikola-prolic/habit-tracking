import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, readBody, getSession, createError } from 'h3'
import { getServerSession } from "#auth"
import { hydrateOnVisible } from 'vue'
import { HabitWithEntries } from '~/prisma/types'

const prisma = new PrismaClient()

// we could add a diff to show what fields has changed but we are good for now 
export interface UpdateHabitResponse {
    habit: HabitWithEntries
}
export interface UpdateHabitObject {
    title?: string;
    description?: string;
    requiredEntries?: number;
    requiredEntryPeriod?: 'DAILY' | 'WEEKLY';
    resetDaily?: boolean;
}

export default defineEventHandler(async (event) => {
    const resp: UpdateHabitResponse = {} as UpdateHabitResponse
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

    const body = await readBody<UpdateHabitObject>(event)

    try {
        const habit = await prisma.habit.update({
            where: {
                id: habitId,
                userId: userId, // Ensure habit belongs to the user
            },
            data: {
                title: body.title,
                description: body.description,
                requiredEntries: parseInt(String(body.requiredEntries)),
                requiredEntryPeriod: body.requiredEntryPeriod,
                resetDaily: body.resetDaily,
            },
        })
        resp.habit = habit
        return resp
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Could not update habit' })
    } finally {
        await prisma.$disconnect()
    }
})
