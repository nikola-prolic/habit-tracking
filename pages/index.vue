<script setup lang='ts'>
  const { status, signIn, signOut } = useAuth()
  const loggedIn = computed(() => status.value == "authenticated")
  console.log("user is: ",loggedIn)

  async function handleSignIn() {
    await signIn('google')
  }

  async function handleSignOut() {
    await signOut()
  }
</script>
<template>
  <div class="">
    <button class="font-roboto font-bold px-4 bg-gray-50 border " v-if="loggedIn" @click="handleSignOut" >logout</button>
    <button v-else @click="handleSignIn" >Sign in with google</button>
  </div>
</template>
