<template>
    <div class="q-pa-md">
        <q-row>
            <q-col>
                <q-btn @click="back" flat rounded>
                    <q-icon name="arrow_back" />
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
                <div v-if="scheduleData.length > 0">
                    <Schedule :schedule="scheduleData"/>
                </div>
            </q-col>
        </q-row>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Schedule from '@components/Schedule.vue';
import { useScheduleStore } from '@store/schedule';

const scheduleStore = useScheduleStore();

const date = ref('1970-01-01');

const scheduleData = ref([]);

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

onMounted(() => {
    console.log('Date page mounted');
    date.value = route.params.date as string;
    scheduleData.value = scheduleStore.getSchedulesByDate(date.value);
    console.log("store data", scheduleData.value);
});
</script>