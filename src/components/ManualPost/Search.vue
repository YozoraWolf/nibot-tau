<template>
  <div class="row items-center q-gutter-md">
    <q-select
      v-model="selectedBooru"
      :options="booruOptions"
      option-label="name"
      label="Booru"
      dense
      outlined
      style="min-width: 160px"
      @update:model-value="onBooruChange"
    />
    <q-input
      v-model="query"
      :label="`Search tags${tagLimit ? ' (max ' + tagLimit + ')' : ''}`"
      dense
      outlined
      class="q-mr-md"
      @keyup.enter="doSearch"
    />
    <q-btn color="primary" label="Search" @click="doSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBooruStore } from '@/store/booru';
import booruData from '@/booru_sv_data.json';

const emit = defineEmits(['search']);
const booruOptions = booruData.filter(b => b.name === 'TestBooru' || b.name === 'Gelbooru');
const selectedBooru = ref(booruOptions[0]);
const query = ref('');

const tagLimit = computed(() => {
  // Example: TestBooru max 2 tags, Gelbooru unlimited
  if (selectedBooru.value.name === 'TestBooru') return 2;
  return null;
});

function onBooruChange() {
  if (tagLimit.value) {
    query.value = query.value.split(' ').slice(0, tagLimit.value).join(' ');
  }
}

const booruStore = useBooruStore();

async function doSearch() {
  let tags = query.value.trim();
  if (tagLimit.value) {
    tags = tags.split(' ').slice(0, tagLimit.value).join(' ');
  }
  await booruStore.searchPosts({
    tags,
    nsfw: false,
    server: selectedBooru.value,
    limit: 20,
    page: 1
  });
  emit('search', booruStore.searchResults);
}
</script>
