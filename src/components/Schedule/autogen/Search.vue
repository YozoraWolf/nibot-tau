<template>
    <div class="search-container">
        <q-input v-model="tags" label="Search Tags" :error="tagError.length > 0" 
        :error-message="tagError"
        />
        <q-checkbox v-model="nsfw" label="Include NSFW posts" />
        <q-select v-model="selectedServer" 
        :options="servers" 
        option-label="name"
        label="Select Server" />
        <q-input v-model.number="limit" label="Limit" type="number" />
        <q-input v-model.number="page" label="Page" type="number" />
        <q-btn @click="searchPosts" label="Search" color="primary" :disable="tagError.length > 0" :loading="booruStore.isLoading"/>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useBooruStore } from '@/store/booru';
import serverData from '@/booru_sv_data.json';
import { BooruSearch, BooruServer } from '@/interfaces/Booru';

const booruStore = useBooruStore();

const tags = ref('');
const nsfw = ref(false);
const limit = ref(21);
const page = ref(1);
const servers = ref<BooruServer[]>(serverData);
const selectedServer = ref(serverData[2]);

const tagError = computed(() => {
    const tagCount = tags.value.split(' ').filter(tag => tag).length;
    if (nsfw.value && tagCount > 1) {
        return 'Maximum 1 tag allowed for NSFW';
    }
    if ((selectedServer.value.name === 'Danbooru' || selectedServer.value.name === 'TestBooru') && tagCount > 2) {
        return 'Maximum 2 tags allowed';
    }
    return '';
});

watch(selectedServer, (newServer) => {
    if (newServer.name === 'Danbooru' || newServer.name === 'TestBooru') {
        tags.value = tags.value.split(' ').slice(0, 2).join(' ');
    }
});

const searchPosts = async () => {
    const search: BooruSearch = {
        tags: tags.value,
        nsfw: nsfw.value,
        server: selectedServer.value,
        limit: limit.value,
        page: page.value
    };
    console.log('Search posts', search);
    await booruStore.searchPosts(search);
};

</script>

<style scoped>
.search-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
