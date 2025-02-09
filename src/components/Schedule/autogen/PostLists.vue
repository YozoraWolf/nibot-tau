<template>
    <div class="post-detail q-pa-md">
        <q-table :rows="socialMediaPosts" :columns="columns" row-key="id" @row-click="selectPost"
            :rows-per-page-options="[5, 10, 21, 0]" :rows-per-page="21">
            <template v-slot:body-cell-preview="props">
                <q-td :props="props">
                    <img :src="props.row.booru_post.preview_url" alt="Preview" class="post-preview" />
                </q-td>
            </template>
            <template v-slot:body-cell-artist="props">
                <q-td :props="props">
                    {{ props.row.booru_post.artist }}
                </q-td>
            </template>
            <template v-slot:body-cell-source="props">
                <q-td :props="props">
                    <a :href="props.row.booru_post.source" target="_blank">{{ props.row.booru_post.source }}</a>
                </q-td>
            </template>
            <template v-slot:body-cell-link="props">
                <q-td :props="props">
                    <a :href="`https://danbooru.donmai.us/posts/${props.row.booru_post.id}`" target="_blank">View on
                        Danbooru</a>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup lang="ts">
import { SocialMediaPost } from '@/interfaces/Post';
import { ref, watch } from 'vue';
import { useBooruStore } from '@/store/booru';

const booruStore = useBooruStore();

const emit = defineEmits(['selectPost']);

const socialMediaPosts = ref<SocialMediaPost[]>([]);

const columns = [
    { name: 'preview', label: 'Preview', align: 'left' as const, field: 'booru_post.preview_url' },
    { name: 'artist', label: 'Artist', align: 'left' as const, field: 'booru_post.artist' },
    { name: 'source', label: 'Source', align: 'left' as const, field: 'booru_post.source' },
    { name: 'link', label: 'Link', align: 'left' as const, field: 'booru_post.id' },
];

const selectPost = (evt: Event, row: SocialMediaPost) => {
    console.log('Select post:', row);
    booruStore.selectPost(row);
};

watch(() => booruStore.socialMediaPosts, (newPosts) => {
    console.log('Social media posts updated:', booruStore.socialMediaPosts);
    socialMediaPosts.value = newPosts;
});
</script>

<style scoped>
.post-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
}
</style>
