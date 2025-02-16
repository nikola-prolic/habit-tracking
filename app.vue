<script setup lang="ts">

const route = useRoute();

// Set layout to 'default' for all routes EXCEPT /auth
const layout = computed(() => {
  return route.path.startsWith('/sign-in') ? false : 'default'; // Set layout to false for no layout on /auth
});

</script>

<template>
  <NuxtLayout :name='layout'>
    <NuxtPage />
  </NuxtLayout>
</template>
