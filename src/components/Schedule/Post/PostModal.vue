<template>
    <q-dialog v-model="show" persistent>
        <q-card>
            <q-card-section>
                <q-input v-model="post.title" label="Title" />
                <q-input v-model="post.startTime" label="Start Time" />
                <q-input v-model="post.endTime" label="End Time" />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancel" color="primary" @click="closeModal" />
                <q-btn label="Save" color="primary" @click="save" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useScheduleStore } from '@store/schedule';
import { useRouter } from 'vue-router';
import Logger from '@/utils/logger';

const logger = new Logger('PostModal');

const router = useRouter();
const scheduleStore = useScheduleStore();

const show = ref(false);

const props = defineProps({
    post: Object,
    date: String,
});

const closeModal = () => {
    show.value = false;
};

const showModal = () => {
    show.value = true;
};

const save = () => {
    scheduleStore.addSchedule(post);
    show.value = false;
    router.push('/');
};

onMounted(async () => {
    await logger.init();
    console.log('Post modal mounted');
    if(!props.post) {
        props.post = scheduleStore.createNewScheduleItem(scheduleStore.getCurrentSelectedDate());
        logger.info('Creating new post');
    }
    console.log('Post modal mounted, id:', props.post.id);
});

defineExpose({
    showModal,
    closeModal,
});
</script>