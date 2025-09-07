<template>
  <div class="post-list q-gutter-xl">
    <div class="post-list-inner q-ml-sm q-mt-sm">
      <q-card
        v-for="post in posts"
        :key="post.id"
        class="post-card cursor-pointer"
        @click="$emit('select', post)"
        flat
        bordered
      >
        <q-img :src="post.preview_url || post.image" ratio="1" />
        <q-card-section>
          <div class="text-subtitle2 q-mb-xs">
            Author: <span>{{ post.tags_artist || post.artist || 'Unknown' }}</span>
          </div>
          <div class="text-caption ellipsis">
            Tags: <span>{{ post.tags_general || post.tags || '' }}</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ posts: any[] }>();
defineEmits(['select']);
</script>

<style scoped>
.post-list {
  width: 100%;
  min-height: 200px;
  border: 2px solid #bbb;
  padding: 24px 16px;
  box-sizing: border-box;
  background: #fafbfc;
  display: flex;
  justify-content: center;
}

.post-list-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
  justify-content: flex-start;
}

.post-card {
  min-width: 220px;
  max-width: 240px;
  border: 1px solid #ccc;
  transition: box-shadow 0.2s;
  margin: 0;
  padding: 0;
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
}
.post-card:hover {
  box-shadow: 0 2px 12px 0 rgba(60,60,60,0.12);
}
</style>
