<template>
  <div class="manual-post-root q-pa-xl">
    <div v-if="!isConnected" class="flex flex-center column">
      <q-card class="q-pa-xl" style="max-width: 400px;">
        <div class="row items-center q-mb-xl">
          <q-icon name="mdi-facebook" size="40px" class="q-mr-lg" color="primary" />
          <div class="text-h5">Connect to Facebook</div>
        </div>
        <q-btn color="primary" @click="connectToFacebook" icon="mdi-link" label="Connect" size="lg" />
      </q-card>
    </div>
    <div v-else>
      <div class="row q-mb-md">
        <UserPagesSelect v-model="selectedPage" />
      </div>
      <div class="row q-mb-md">
        <Search @search="handleSearch" />
      </div>
      <div class="row q-py-xl">
        <PostList :posts="posts" @select="openPostModal" />
      </div>
      <PostModal v-model="showModal" :post="selectedPost" :page="selectedPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFacebookAuth } from '@/composables/useFacebookAuth';
import UserPagesSelect from '@/components/ManualPost/UserPagesSelect.vue';
import Search from '@/components/ManualPost/Search.vue';
import PostList from '@/components/ManualPost/PostList.vue';
import PostModal from '@/components/ManualPost/PostModal.vue';
import { GenericBooruPost } from '@/interfaces/BooruPost';

const { login, connected } = useFacebookAuth();

const isConnected = computed(() => connected.value);

const posts = ref<GenericBooruPost[]>([]);
const selectedPost = ref(null);
const showModal = ref(false);
const selectedPage = ref(null);

const connectToFacebook = async () => {
  await login();
};

const handleSearch = (results: GenericBooruPost[]) => {
  posts.value = results;
};

const openPostModal = (post: any) => {
  selectedPost.value = post;
  showModal.value = true;
};
</script>

<style scoped>
.manual-post-root {
  min-height: 100vh;
}
</style>
