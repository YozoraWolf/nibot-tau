<template>
    <q-dialog v-model="show" persistent>
        <q-card>
            <q-card-section>
                <q-input v-model="localPost.title" label="Title" />
                <q-input v-model="localPost.startTime" label="Start Time" />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancel" color="primary" @click="closeModal" />
                <q-btn label="Save" color="primary" @click="save" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue';
import { useScheduleStore } from '@/store/schedule';
import { useRouter } from 'vue-router';
import Logger from '@/utils/logger';
import { cloneDeep } from 'lodash';

const logger = new Logger('PostModal');

const router = useRouter();
const scheduleStore = useScheduleStore();

const show = ref(false);


const localPost: Ref<any>= ref();
const date = ref('');

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
    scheduleStore.addScheduleItem(date.value, localPost.value.post);
    show.value = false;
    router.push('/');
};

onMounted(async () => {
    localPost.value = cloneDeep(props.post);
    await logger.init();
    console.log('Post modal mounted');
    console.log('Post modal mounted:', localPost.value);
    date.value = scheduleStore.getCurrentSelectedDate();
});

watch(() => props.post, (newVal) => {
    localPost.value = cloneDeep(newVal);
});

defineExpose({
    showModal,
    closeModal,
});
</script>