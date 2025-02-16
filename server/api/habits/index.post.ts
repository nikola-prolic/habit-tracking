import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { getServerSession } from '#auth'
import { HabitWithEntries } from '~/prisma/types'

const prisma = new PrismaClient()

export interface CreateHabitResponse {
    habit: HabitWithEntries
}

export interface CreateHabitObject {
    title: string;
    description?: string;
    requiredEntries: number;
    requiredEntryPeriod: 'DAILY' | 'WEEKLY';
}

export default defineEventHandler(async (event) => {
    const resp: CreateHabitResponse = {} as CreateHabitResponse
    const session = await getServerSession(event)
    const userId = session?.user?.id;

    if (!userId) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const body = await readBody<CreateHabitObject>(event)

    try {
        const habit = await prisma.habit.create({
            data: {
                userId: userId,
                title: body.title,
                description: body.description,
                requiredEntries: parseInt(String(body.requiredEntries)),
                requiredEntryPeriod: body.requiredEntryPeriod,
            },
            include: {
                entries: true
            }
        })
        if (!habit) {
            throw createError({ status: 500, message: "we could not create habit please check with support" })
        }
        resp.habit = habit
        return resp
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Could not create habit' })
    } finally {
        await prisma.$disconnect()
    }
})
