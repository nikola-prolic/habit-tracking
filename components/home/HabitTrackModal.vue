<script setup lang="ts">
import { useMainStore } from '~/stores/main';

interface Props {
    habitId: number;
}

const props = defineProps<Props>();

const mainStore = useMainStore();

// Modal visibility state
const isModalVisible = ref(false);
const note = ref('');
const entryError = ref<string | null>(null);
const entrySuccess = ref<boolean>(false);

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
    note.value = '';
    entryError.value = null;
    entrySuccess.value = false;
};

const trackHabit = async () => {
    entryError.value = null;
    entrySuccess.value = false;
    if (!props.habitId) {
        entryError.value = 'Habit ID is missing.';
        return;
    }

    const entryData = {
        habitId: props.habitId,
        note: note.value,
    };

    const createdEntry = await mainStore.createEntry(entryData);
    if (createdEntry) {
        entrySuccess.value = true;
        note.value = ''; // Clear note after successful entry
        setTimeout(() => {
            entrySuccess.value = false; // Clear success message after a delay
            closeModal();
        }, 1500); // Success message for 1.5 seconds
    } else {
        entryError.value = mainStore.entryError || 'Failed to track habit entry.';
    }
};

</script>

<template>
    <div class="habit-track-modal">
        <button @click="openModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Track
        </button>

        <div v-if="isModalVisible" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="track-habit-modal"
            role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                    @click="closeModal"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="track-habit-modal">
                                    Track Habit Entry
                                </h3>
                                <div class="mt-2">
                                    <textarea v-model="note" rows="3"
                                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Add a note (optional)"></textarea>
                                </div>
                            </div>
                        </div>
                        <div v-if="entryError" class="text-red-500 mt-2 text-sm">{{ entryError }}</div>
                        <div v-if="entrySuccess" class="text-green-500 mt-2 text-sm">Entry tracked successfully!
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="trackHabit">
                            Track
                        </button>
                        <button type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="closeModal">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Modal styles - moved from template to scoped style for better organization */
.fixed.z-10.inset-0.overflow-y-auto {
    display: none;
    /* Hidden by default */
}

.fixed.z-10.inset-0.overflow-y-auto[aria-modal="true"] {
    display: block;
    /* Show modal when isModalVisible is true */
}
</style>
