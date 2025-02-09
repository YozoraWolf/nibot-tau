<template>
  <div class="q-pa-md window-width window-height">
    <q-layout view="hHh Lpr lff">

      <q-drawer v-model="drawer" :mini="miniState" @mouseenter="miniState = false" @mouseleave="miniState = true"
        :width="200">
        <q-scroll-area class="fit">
          <q-list padding>
            <template v-for="(item, index) in menuList" :key="index">
              <q-item clickable v-ripple @click="openPage(index)" :class="`${activeIndex === index ? 'activeClass' : ''}`">
                <q-item-section avatar class="flex items-center justify-center">
                  <q-icon size="sm" :name="`${item.icon}`" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator v-if="!item.separator" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view v-slot="{ Component }">
            <transition name="slide-x" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>

</template>

<script setup lang="ts">
import { useScheduleStore } from "@/store/schedule";
import { onMounted, ref } from "vue";
import { router } from "./router";

const menuList = [
  { label: "Calendar", icon: "event", separator: false, route: "/calendar" },
  { label: "Today", icon: "upcoming", separator: false, route: "/today" },
  { label: "Connections", icon: "group", separator: false, route: "/connections" },
  { label: "Settings", icon: "settings", separator: false, route: "/settings" }
];

const scheduleStore = useScheduleStore();

const drawer = ref(true);
const miniState = ref(true);
const activeIndex = ref(0);

const openPage = (index: number) => {
  miniState.value = true; 
  activeIndex.value = index;
  console.log("Opening page", menuList[index].route);
  router.push(menuList[index].route);
};

onMounted(async () => {
  // Initialize schedule store
  await scheduleStore.init();
  // default to calendar
  openPage(0);
});
</script>


<style lang="scss" scoped>
@use 'sass:color';

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


.activeClass {
  background-color: color.adjust($dark, $lightness: 10%);
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

.drawer-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

</style>
