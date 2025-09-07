<template>
  <q-select
    v-bind:model-value="modelValue"
    v-on:update:model-value="val => emit('update:modelValue', val)"
    :options="pages"
    label="Select Facebook Page"
    option-label="name"
    option-value="id"
    emit-value
    map-options
    dense
    outlined
    style="min-width: 250px;"
  />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { getFacebookPages } from '@/utils/FacebookHelper';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const pages = ref<{ id: string; name: string }[]>([]);
const DEFAULT_PAGE_KEY = 'fb_default_page';

onMounted(async () => {
  try {
    pages.value = await getFacebookPages();
    let defaultPage = localStorage.getItem(DEFAULT_PAGE_KEY);

    // If no default page, use the first page
    if (!defaultPage && pages.value.length > 0) {
      defaultPage = pages.value[0].id;
      localStorage.setItem(DEFAULT_PAGE_KEY, defaultPage);
    }

    // If current modelValue is not set, set to default page
    if (!props.modelValue && defaultPage) {
      emit('update:modelValue', defaultPage);
    }
  } catch (err) {
    pages.value = [];
    if (!props.modelValue) emit('update:modelValue', 'me');
  }
});

watch(
  () => props.modelValue,
  val => {
    if (val) localStorage.setItem(DEFAULT_PAGE_KEY, val);
    emit('update:modelValue', val);
  }
);
</script>
