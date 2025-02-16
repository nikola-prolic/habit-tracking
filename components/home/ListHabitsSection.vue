<script setup lang="ts">
import { HabitWithEntries } from '../../prisma/types'
defineProps({
    hasHabits: {
        type: Boolean,
        required: true,
    },
});
const mainStore = useMainStore();

const { habits } = storeToRefs(mainStore); // Destructure the 'habits' ref
</script>

<template>
    <section class="habit-list-section bg-white  rounded p-6 mt-6">
        <h2 class="font-semibold mb-4">Habit List</h2>
        <div v-if="hasHabits"
            class="habit-cards-container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
        </div>
        <div v-else class="text-gray-500">
            <p>You have no saved habits, please add a habit to start tracking.</p>
        </div>
    </section>
</template>
