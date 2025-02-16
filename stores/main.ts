import type { Entry, Habit } from "@prisma/client"
import type { HabitWithEntries } from "~/prisma/types"
import type { DeleteEntryResponse } from "~/server/api/entries/[id].delete"
import type { EntryFilterRequest, GetAllEntriesResponse } from "~/server/api/entries/index.get"
import type { CreateEntryRequest, CreateEntryResponse } from "~/server/api/entries/index.post"
import type { UpdateHabitObject, UpdateHabitResponse } from "~/server/api/habits/[id].put"
import type { GetHabitsResponse } from "~/server/api/habits/index.get"
import type { CreateHabitObject, CreateHabitResponse } from "~/server/api/habits/index.post"

export const useMainStore = defineStore('main', () => {
  const user = ref()
  const habits = ref<HabitWithEntries[]>([])
  const error = ref<string | null>(null) // Add an error ref to the store
  const entries = ref<Entry[]>([]) // Entries state
  const entryError = ref<string | null>(null) // Entry error state

  async function initUser() {
    const { data } = useAuth()
    if (data.value) {
      user.value = data.value.user
    } else {
      user.value = null
    }
  }

  async function fetchHabits() {
    error.value = null // Clear any previous errors before fetching
    try {
      const response: GetHabitsResponse = await $fetch('/api/habits', {
        method: "GET"
      })
      if (response && response?.habits) {
        habits.value = response.habits
      }
    } catch (e) {
      error.value = 'Failed to fetch habits. Please try again.' // Set a user-friendly error message
      console.error("Error fetching habits:", e) // Still log the detailed error for debugging
      // In a real app, you might want to use a more sophisticated error logging service
    }
  }

  async function getHabitById(id: number) {
    error.value = null
    try {
      const response = await $fetch(`/api/habits/${id}`)
      return response.habit // Return the habit object directly
    } catch (e) {
      error.value = `Failed to fetch habit with ID ${id}.`
      console.error(`Error fetching habit with ID ${id}:`, e)
      return null // Or handle error as needed in component
    }
  }

  async function updateHabit(id: number, habitData: UpdateHabitObject) {
    error.value = null
    try {
      const response: UpdateHabitResponse = await $fetch(`/api/habits/${id}`, {
        method: 'PUT',
        body: habitData
      })
      if (response.habit) {
        // Update the habits array in the store for better reactivity (optional, but good practice)
        const index = habits.value.findIndex((h: Habit) => h.id === id)
        if (index !== -1) {
          habits.value.splice(index, 1, response.habit) // Replace the old habit with the updated one
        }
        return response.habit
      }
      return null // Or handle if habit is not in response
    } catch (e) {
      error.value = `Failed to update habit with ID ${id}.`
      console.error(`Error updating habit with ID ${id}:`, e)
      return null
    }
  }

  async function createHabit(habitData: CreateHabitObject) {
    error.value = null
    try {
      const response: CreateHabitResponse = await $fetch('/api/habits', {
        method: 'POST',
        body: habitData
      })
      if (response.habit) {
        habits.value.unshift(response.habit) // Add new habit to the beginning of the array (for reactivity)
        return response.habit
      }
      return null
    } catch (e) {
      error.value = 'Failed to create new habit.'
      console.error('Error creating new habit:', e)
      return null
    }
  }

  async function deleteHabit(id: number) {
    error.value = null
    try {
      await $fetch(`/api/habits/${id}`, {
        method: 'DELETE'
      })
      await fetchHabits() //this refeches all habits after deleting a habit | if the app has 100000s of users then we need to refactor
      return true // Indicate successful deletion
    } catch (e) {
      error.value = `Failed to delete habit with ID ${id}.`
      console.error(`Error deleting habit with ID ${id}:`, e)
      return false // Indicate deletion failure
    }
  }

  //Entries

  async function fetchEntries(filters?: EntryFilterRequest) {
    entryError.value = null
    try {
      const response = await $fetch<GetAllEntriesResponse>('/api/entries', {
        query: filters // Pass filters as query parameters
      })
      if (response.entries) {
        entries.value = response.entries
      }
    } catch (e) {
      entryError.value = 'Failed to fetch entries. Please try again.'
      console.error("Error fetching entries:", e)
    }
  }

  async function createEntry(entryData: CreateEntryRequest) {
    entryError.value = null
    try {
      const response = await $fetch<CreateEntryResponse>('/api/entries', {
        method: 'POST',
        body: entryData
      })
      if (response) { // API returns the created entry directly
        entries.value.unshift(response) // Add new entry to the beginning of the array
        return response; // Return the created entry
      }
      return null
    } catch (e) {
      entryError.value = 'Failed to create new entry.'
      console.error('Error creating new entry:', e)
      return null
    }
  }

  async function deleteEntry(id: number) {
    entryError.value = null
    try {
      await $fetch<DeleteEntryResponse>(`/api/entries/${id}`, {
        method: 'DELETE'
      })
      entries.value = entries.value.filter(entry => entry.id !== id)
      return true
    } catch (e) {
      entryError.value = `Failed to delete entry with ID ${id}.`
      console.error(`Error deleting entry with ID ${id}:`, e)
      return false
    }
  }


  return {
    user,
    initUser,
    habits,
    fetchHabits,
    getHabitById,
    updateHabit,
    createHabit,
    deleteHabit,
    error,
    entries, // Expose entries state
    fetchEntries, // Expose fetchEntries action
    createEntry, // Expose createEntry action
    deleteEntry, // Expose deleteEntry action
    entryError, // Expose entryError state
  }
})

if (import.meta.hot) {
  import.meta.hot?.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}

