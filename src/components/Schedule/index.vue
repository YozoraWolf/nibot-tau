<template>
    <div class="schedule-container q-pa-md q-gutter-sm">
        <div v-for="hour in hours" :key="hour" class="hour-row">
            <!-- Time Label -->
            <div class="time-label">
                {{ formatHour(hour) }}
            </div>

            <!-- Time Slot -->
            <div class="time-slot">
                <template v-if="expandedClusters[hour] || getScheduleForHour(hour).length <= 5">
                    <ScheduleItem clickable @click="openPostModal(event)" 
                    v-for="(event, index) in getScheduleForHour(hour)" 
                    :key="event.id" :event="event"></ScheduleItem>
                </template>
                <template v-else>
                    <q-expansion-item :label="`${getScheduleForHour(hour).length} posts`" class="full-width">
                        <ScheduleItem clickable @click="openPostModal(event)" 
                        v-for="(event, index) in getScheduleForHour(hour)" 
                        :key="event.id" :event="event"></ScheduleItem>
                    </q-expansion-item>
                </template>
            </div>
        </div>
        <div v-if="selectedPost">
            <PostModal ref="postModal" :post="selectedPost" :date="date" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import ScheduleItem from "./ScheduleItem.vue";
import PostModal from "./Post/PostModal.vue";

const props = defineProps({
    schedule: {
        type: Array,
        required: true,
    },
});

const selectedPost = ref(null);
const postModal = ref(null);

const hours = Array.from({ length: 24 }, (_, i) => i);
const expandedClusters = ref<Record<number, boolean>>({}); // Tracks expanded clusters

const formatHour = (hour: number) => {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
};

const getScheduleForHour = (hour: number) => {
    return props.schedule.filter((event) => {
        const scheduleStart = parseTime(event.startTime);
        return Math.floor(scheduleStart) === hour;
    });
};

const parseTime = (time: string) => {
    if (!time) return 0;
    const [hour, minute] = time.split(":").map(Number);
    return hour + minute / 60;
};

const openPostModal = (event) => {
    selectedPost.value = event;
    postModal.value.showModal();
};

onMounted(() => {
    console.log("Schedule component mounted");
});
</script>

<style lang="scss" scoped>
.schedule-container {
    display: flex;
    flex-direction: column;
}

.hour-row {
    display: flex;
    align-items: stretch;
    /* Ensure rows match height */
    min-height: 40px;
    /* Base height for empty rows */
    border-top: 1px solid $grid-lines-color-light;

    .q-dark & {
        border-top: 1px solid $grid-lines-color-dark;
    }
}


.time-column {
    width: 80px;

    .time-label {
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        padding: 10px;
        background-color: #f9f9f9;

        .q-dark & {
            background-color: #2c2c2c;
        }
    }

}

.grid-column {
    flex: 1;
    position: relative;

    .time-slot {
        flex: 1;
        position: relative;
        padding-bottom: 10px;
        /* Space between events */
    }

    .event.cluster {
        background-color: #ff9800;
        cursor: pointer;
        text-align: center;
    }
}
</style>
