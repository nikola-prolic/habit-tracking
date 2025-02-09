import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    const userEmail = session?.user?.email;

    if (!userEmail) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const body = await readBody(event)
    const habitId = parseInt(body.habitId)


    if (isNaN(habitId)) {
        throw createError({ statusCode: 400, message: 'Invalid Habit ID' })
    }


    try {
        const entry = await prisma.entry.find({
            data: {
                habitId: habitId,
                userId: userId,
            },
        })
        return entry
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Could not create entry', error })
    } finally {
        await prisma.$disconnect()
    }
})
