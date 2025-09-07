<template>
  <q-chip
    class="calendar-item"
    square
    dense
    clickable
    @click.stop="$emit('click', item)"
    @contextmenu.prevent="openMenu"
  >
    <q-avatar v-if="item.image">
      <img :src="item.image" />
    </q-avatar>
    <span>#{{ item.id }}</span>
  </q-chip>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  item: {
    id: string | number,
    image?: string
  }
}>();

const menu = ref(false);

function openMenu(e: MouseEvent) {
  menu.value = true;
}
</script>

<style scoped>
.calendar-item {
  max-width: 100%;
  margin-bottom: 2px;
  font-size: 0.9em;
}
</style>
