<script setup lang="ts">
import { useMainStore } from "~/stores/main"

const { signOut } = useAuth()
const mainStore = useMainStore()
const { initUser, fetchHabits } = mainStore
const { user, habits } = storeToRefs(mainStore); // Use storeToRefs to destructure reactive refs
onMounted(() => {
  initUser()
  fetchHabits()
})

</script>

<template>
  <div class="app-layout">
    <header class="app-header bg-gray-100 shadow-md">
      <div class="top-bar p-4 flex justify-between items-center container mx-auto">
        <div class="flex items-center">
          <h1 class="text-xl font-bold mr-4">Balance Track</h1>
          <span v-if="user?.name" class="font-semibold text-gray-700 hidden sm:inline">Hi, {{ user.name }}!</span>
        </div>
        <div class="flex justify-end space-x-2">

          <AddHabitModal />
          <button @click="signOut()" class="font-bold py-2 px-4 text-red-500 ">Logout</button>
        </div>
      </div>
    </header>

    <div class="app-content p-6 container mx-auto">
      <NuxtPage />
    </div>

    <footer class="app-footer bg-gray-200 p-4 text-center">
      <slot name="footer">
        <p>&copy; 2025 Balance Track</p>
      </slot>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-content {
  flex: 1;
}
</style>
