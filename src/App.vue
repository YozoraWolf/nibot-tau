
<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-x" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { useScheduleStore } from "@/store/schedule";
import { onMounted } from "vue";

const scheduleStore = useScheduleStore();

onMounted(async () => {
  // Initialize schedule store
  await scheduleStore.init();
});
</script>


<style scoped>
.slide-x-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-x-enter-from,
.slide-x-leave-to {
  transform: translateX(15px);
  opacity: 0;
}
.slide-x-enter-to,
.slide-x-leave-from {
  transform: translateX(0);
  opacity: 1;
}

#app {
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
}

body {
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
}

html {
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
}
</style>
