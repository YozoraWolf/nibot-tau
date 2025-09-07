<template>
  <q-menu
    v-bind:model-value="modelValue"
    context-menu
    v-on:update:model-value="val => emit('update:modelValue', val)"
  >
    <q-list dense style="min-width: 180px;">
      <template v-if="context === 'day'">
        <q-item clickable v-close-popup @click="openDay">
          <q-item-section>Open Day</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="generatePosts">
          <q-item-section>Generate Posts</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="cancelAllPosts">
          <q-item-section>Cancel all Posts</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="clearAllDonePosts">
          <q-item-section>Clear all Done posts</q-item-section>
        </q-item>
      </template>
      <!-- Add more context-specific menus as needed -->
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean,
  context: 'item' | 'day',
  item?: any
}>();
const emit = defineEmits(['update:modelValue']);

function openDay() {
  // TODO: Implement open day logic
}
function generatePosts() {
  // TODO: Implement generate posts logic
}
function cancelAllPosts() {
  // TODO: Implement cancel all posts logic
}
function clearAllDonePosts() {
  // TODO: Implement clear all done posts logic
}
</script>