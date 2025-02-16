<script setup lang="ts">
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore();

// Modal visibility state
const isModalVisible = ref(false);

// Form data refs (form fields)
const habitTitle = ref('');
const habitDescription = ref('');
const requiredEntries = ref(1); // Default value
const requiredEntryPeriod = ref('DAILY'); // Default value

// Function to open the modal
const openModal = () => {
    isModalVisible.value = true;
};

// Function to close the modal
const closeModal = () => {
    isModalVisible.value = false;
    resetForm(); // Clear form when modal is closed
};

// Function to reset the form fields
const resetForm = () => {
    habitTitle.value = '';
    habitDescription.value = '';
    requiredEntries.value = 1;
    requiredEntryPeriod.value = 'DAILY';
    mainStore.error = null; // Clear any previous errors
};

// Function to handle form submission (Create Habit)
const handleCreateHabit = async () => {
    const habitData = {
        title: habitTitle.value,
        description: habitDescription.value,
        requiredEntries: Number(requiredEntries.value), // Ensure it's a number
        requiredEntryPeriod: requiredEntryPeriod.value,
    };

    await mainStore.createHabit(habitData); // Call the createHabit action from the store

    if (!mainStore.error) {
        // Habit created successfully
        closeModal(); // Close the modal
        await mainStore.fetchHabits(); // Refetch habits to update the list (or update store directly for better reactivity)
        // Optionally provide user feedback (e.g., toast notification)
        console.log('Habit created successfully!');
    } else {
        // Handle error - error message is already in mainStore.error
        console.error('Error creating habit:', mainStore.error);
        // Error message will be displayed in the modal template
    }
};
</script>

<template>
    <div>
        <button @click="openModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Habit
        </button>

        <div v-if="isModalVisible" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
            role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                    @click="closeModal"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                            Create a New Habit
                        </h3>
                        <div class="mt-2">
                            <form @submit.prevent="handleCreateHabit">
                                <div class="mb-4">
                                    <label for="habit-title"
                                        class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                    <input v-model="habitTitle" type="text" id="habit-title"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Habit Title" required>
                                </div>
                                <div class="mb-4">
                                    <label for="habit-description"
                                        class="block text-gray-700 text-sm font-bold mb-2">Description
                                        (Optional)</label>
                                    <textarea v-model="habitDescription" id="habit-description"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Description"></textarea>
                                </div>
                                <div class="mb-4">
                                    <label for="required-entries"
                                        class="block text-gray-700 text-sm font-bold mb-2">Required Entries</label>
                                    <input v-model.number="requiredEntries" type="number" id="required-entries"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        min="1" required>
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Required Entry
                                        Period</label>
                                    <div class="flex items-center">
                                        <input v-model="requiredEntryPeriod" type="radio" id="period-daily"
                                            value="DAILY" class="mr-2" required>
                                        <label for="period-daily" class="text-gray-700 text-sm mr-4">Daily</label>
                                        <input v-model="requiredEntryPeriod" type="radio" id="period-weekly"
                                            value="WEEKLY" class="mr-2" required>
                                        <label for="period-weekly" class="text-gray-700 text-sm">Weekly</label>
                                    </div>
                                </div>

                                <div v-if="mainStore.error" class="text-red-500 mb-4">
                                    {{ mainStore.error }}
                                </div>

                                <div class="flex justify-end">
                                    <button type="button"
                                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                        @click="closeModal">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Create Habit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Basic modal styling (you can customize this) */
.fixed.z-10.inset-0.overflow-y-auto {
    display: none;
    /* Hidden by default, visibility controlled by v-if */
}

.fixed.z-10.inset-0.overflow-y-auto[aria-modal="true"] {
    display: block;
    /* Show modal when isModalVisible is true */
}
</style>
