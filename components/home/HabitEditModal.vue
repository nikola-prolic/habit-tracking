<template>
    <div>
        <button @click="openModal"
            class="text-gray-400 hover:text-gray-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            type="button">
            Edit
        </button>

        <div v-if="isVisible" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
            aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                    @click="closeModal"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Edit Habit
                                </h3>
                                <div class="mt-2">
                                    <form @submit.prevent="submitForm">
                                        <div class="mb-4">
                                            <label for="title"
                                                class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                            <input type="text" id="title" v-model="form.title"
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required>
                                        </div>
                                        <div class="mb-4">
                                            <label for="description"
                                                class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                            <textarea id="description" v-model="form.description"
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                                        </div>
                                        <div class="mb-4">
                                            <label for="requiredEntries"
                                                class="block text-gray-700 text-sm font-bold mb-2">Required
                                                Entries</label>
                                            <input type="number" id="requiredEntries"
                                                v-model.number="form.requiredEntries"
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required min="1">
                                        </div>
                                        <div class="mb-4">
                                            <label for="requiredEntryPeriod"
                                                class="block text-gray-700 text-sm font-bold mb-2">Required Entry
                                                Period</label>
                                            <select id="requiredEntryPeriod" v-model="form.requiredEntryPeriod"
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                            </select>
                                        </div>
                                        <div class="mt-5 sm:mt-6">
                                            <button type="submit"
                                                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { Habit } from '../../prisma/types';
import { useMainStore } from '~/stores/main'; // Import the store

interface Props {
    habit: Habit | undefined;
}
const props = defineProps<Props>();


const isVisible = ref(false); // Modal visibility is now managed internally
const form = ref({
    id: '',
    title: '',
    description: '',
    requiredEntries: 1,
    requiredEntryPeriod: 'DAILY'
});

const store = useMainStore(); // Use the store

watch(() => props.habit, (newHabit) => {
    if (newHabit) {
        form.value = { ...newHabit };
    }
});

const openModal = () => {
    if (props.habit) {
        form.value = { ...props.habit };
    }
    isVisible.value = true;
};
const closeModal = () => {
    isVisible.value = false;
};

const submitForm = async () => {
    if (props.habit?.id) { // Ensure habit and id are available
        try {
            const updatedHabit = await store.updateHabit(props.habit.id, form.value); // Use store action
            if (updatedHabit) {
                closeModal();
            } else {
                console.error('Failed to update habit.'); // Handle failure (optional: display error message to user)
            }
        } catch (error) {
            console.error('Error updating habit:', error);
            // Handle error appropriately (e.g., display error message)
        }
    }
};
</script>
