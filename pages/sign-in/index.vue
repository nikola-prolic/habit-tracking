<script setup lang="ts">
  definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
  })
  const { signIn } = useAuth()

  async function handleSignIn() {
    await signIn('google')
  }
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <div class="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 justify-center items-center">
      <div class="max-w-md text-white">
        <h2 class="text-3xl font-bold mb-4">Welcome to Habit Tracker</h2>
        <p class="text-lg">Track your habits, achieve your goals, and build a better you. Sign up or sign in to get started!</p>
        </div>
    </div>

    <div class="flex w-full lg:w-1/2 justify-center items-center p-8">
      <div class="bg-white shadow-md rounded px-8 py-12 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Sign In</h2>
        <button
          @click="handleSignIn"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign in with Google
        </button>
        </div>
    </div>
  </div>
</template>
