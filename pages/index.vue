<script setup lang="ts">
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore();
const hasHabits = ref(false);

onMounted(() => {
  mainStore.initUser();
  mainStore.fetchHabits();
});

watch(
  () => mainStore.habits,
  (newHabits: any) => {
    hasHabits.value = newHabits.length > 0;
  },
  { immediate: true }
);

</script>

<template>
  <div class="home-page">

    <ListHabitsSection :hasHabits="true" />
  </div>
</template>
