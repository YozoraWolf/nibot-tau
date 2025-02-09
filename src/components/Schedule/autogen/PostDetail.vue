<template>
    <div>
        <div v-if="post">
            <div class="post-detail">
                <div class="bot-cont row q-col-gutter-md full-width">
                    <q-avatar class="col-auto">
                        <q-img v-if="post.bot?.avatar" :src="post.bot?.avatar" />
                        <q-icon v-else name="account_circle" />
                    </q-avatar>

                    <q-select v-model="selectedBot" :options="bots" label="Select Bot" class="col-10" />
                </div>
                <div class="post-cont">
                    <q-img v-if="post.booru_post?.preview_url" 
                    :src="post.booru_post?.preview_url"
                    class="justify-self" />
                    <q-input v-model="post.message" label="Message" type="textarea" />
                    <div class="buttons">
                        <q-btn @click="addArtist" label="Add Artist" />
                        <q-btn @click="addSource" label="Add Source" />
                        <q-btn @click="addBooru" label="Add Booru" />
                        <q-btn @click="addBotSignature" label="Add Bot Signature" />
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBooruStore } from '@/store/booru';
import { SocialMediaPost } from '@/interfaces/Post';

const booruStore = useBooruStore();

const post = ref<SocialMediaPost>();

watch(() => booruStore.selectedPost, (newPost) => {
    console.log('Selected post updated:', booruStore.selectedPost);
    if (booruStore.selectedPost) {
        post.value = booruStore.selectedPost;
    }
}, { deep: true });

const bots = ref(['Bot 1', 'Bot 2']);
const selectedBot = ref('');

const addArtist = () => {
    if (post.value && post.value.booru_post) {
        post.value.message += `\nArtist: ${post.value.booru_post.artist}`;
    }
};

const addSource = () => {
    if (post.value && post.value.booru_post) {
        post.value.message += `\nSource: ${post.value.booru_post.source}`;
    }
};

const addBooru = () => {
    if (post.value && post.value.booru_post) {
        post.value.message += `\nBooru: ${post.value.booru_post.tags}`;
    }
};

const addBotSignature = () => {
    if (post.value) {
        post.value.message += `\n${selectedBot.value}`;
    }
};

function generateRandomId(): number {
    return Math.floor(Math.random() * 1000);
}
</script>

<style scoped>
.post-detail {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.buttons {
    display: flex;
    gap: 10px;
}
</style>
