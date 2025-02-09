<template>
    <q-card class="autogen-container q-col-gutter-md" style="max-width: 1200px; width: 1200px;">
        <div class="row">
            <div class="col-6">
                <Search/>
                <PostLists @selectPost="handleSelectPost" />
            </div>
            <div class="col-6 q-px-md">
                <PostDetail/>
            </div>
        </div>
        <div class="row actions">
            <div class="col">
                <q-btn @click="generatePosts" label="Generate" color="primary" />
                <q-btn @click="close" label="Cancel" />
            </div>
        </div>
    </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Search from './Search.vue';
import PostLists from './PostLists.vue';
import PostDetail from './PostDetail.vue';
import { BooruPost } from '@/interfaces/Booru';

import { useBooruStore } from '@/store/booru';
import { cloneDeep } from 'lodash';
import { SocialMediaPost } from '@/interfaces/Post';

const booruStore = useBooruStore();

const props = defineProps({
    date: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['close']);

const localPosts = ref<SocialMediaPost[]>([]);
const selectedPost = ref<SocialMediaPost>();

const handleSelectPost = (post: BooruPost) => {
    selectedPost.value = {
        id: generateRandomId(),
        title: "Title Here",
        message: "Message Here",
        bot: undefined,
        sm_type: undefined,
        timestamp: undefined,
        booru_post: post,
    };
};

const generatePosts = () => {
    console.log('Generate posts for the date', props.date);
    // Implement the logic to generate posts
};

const close = () => {
    emit('close');
};

const generateRandomId = (): number => {
    return Math.floor(Math.random() * 1000);
};
</script>

<style scoped>
.autogen-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.actions {
    display: flex;
    justify-content: space-between;
}
</style>
