<template>
    <div>
        <button @click="openModal" class="text-red-500 hover:text-red-700 focus:outline-none" aria-label="Delete habit">
            <svg fill="red" width="28px" height="28px" viewBox="-6.7 0 122.88 122.88" version="1.1" id="Layer_1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                enable-background="new 0 0 109.484 122.88" xml:space="preserve">

                <g>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z" />

                </g>

            </svg>
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
                            <div
                                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Delete Habit
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        Are you sure you want to delete the habit "{{ habitName }}"? This action cannot
                                        be undone. Please type the habit name "{{ habitName }}" to confirm.
                                    </p>
                                </div>
                                <div class="mt-4">
                                    <input type="text" v-model="confirmationText"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Type habit name to confirm">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="confirmDelete" :disabled="isDeleteDisabled">
                            Delete
                        </button>
                        <button type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="closeModal">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch } from 'vue';
import { Habit } from '../../prisma/types';
import { useMainStore } from '~/stores/main'; // Import the store

interface Props {
    habit: Habit | undefined;
}
const props = defineProps<Props>();


const isVisible = ref(false); // Modal visibility is now managed internally
const confirmationText = ref('');
const habitName = computed(() => props.habit?.title || '');
const isDeleteDisabled = computed(() => confirmationText.value !== habitName.value);

const store = useMainStore(); // Use the store


const openModal = () => {
    confirmationText.value = ''; // Reset confirmation text when modal opens
    isVisible.value = true;
};
const closeModal = () => {
    isVisible.value = false;
};

const confirmDelete = async () => {
    if (isDeleteDisabled.value) {
        return; // Should not happen due to button disabled state, but for safety
    }
    try {
        if (props.habit?.id) {
            const success = await store.deleteHabit(props.habit.id); // Use store action
            if (success) {
                closeModal();
            } else {
                console.error('Failed to delete habit.'); // Handle failure (optional: display error message to user)
            }
        }
    } catch (error) {
        console.error('Error deleting habit:', error);
        // Handle error appropriately (e.g., display error message)
    }
};
</script>
