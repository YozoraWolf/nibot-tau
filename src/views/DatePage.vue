<template>
    <div class="q-pa-md">
        <q-row class="row justify-between">
            <q-col>
                <q-btn @click="back" flat rounded color="primary">
                    <q-icon name="arrow_back" />
                </q-btn>
            </q-col>
            <q-col>
                <q-btn @click="toggleAutoGen" rounded color="primary">
                    Auto Generate posts for day
                </q-btn>
            </q-col>
        </q-row>
        <q-row>
            <q-col>
                <h3>{{ formattedDate }}</h3>
            </q-col>
        </q-row>
        <q-row>
            <q-col>
                <Schedule :schedule="scheduleData"/>
            </q-col>
        </q-row>
        <q-dialog v-model="isAutoGenOpen" persistent style="max-width: 800px">
            <AutoGen :date="date" @close="toggleAutoGen" />
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted, computed, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Schedule from '@/components/Schedule/index.vue';
import { useScheduleStore } from '@/store/schedule';
import AutoGen from '@/components/Schedule/autogen/index.vue';

const scheduleStore = useScheduleStore();

const date = ref('1970-01-01');
const isAutoGenOpen = ref(false);

const scheduleData: Ref<any> = ref([]);

const route = useRoute();
const router = useRouter();

const useDateFormat = (date: Date, format: string) => {
    return dayjs(date).format(format);
};

const formattedDate = computed(() => {
    return useDateFormat(new Date(date.value), 'YYYY-MM-DD');
});

const back = () => {
    router.push('/');
};

const toggleAutoGen = () => {
    isAutoGenOpen.value = !isAutoGenOpen.value;
};

onMounted(() => {
    console.log('Date page mounted');
    date.value = route.params.date as string;
    scheduleData.value = scheduleStore.getSchedulesByDate(date.value);
    console.log("store data", scheduleData.value);
});
</script>

<style lang="scss" scoped>
.q-dialog__inner {
  transform: translate3d(0, 0, 0);
  will-change: transform, opacity;
}
</style>