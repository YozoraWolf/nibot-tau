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
                    <q-item :clickable="getScheduleForHour(hour).length > 5" v-for="(event, index) in getScheduleForHour(hour)" :key="event.id" class="event"
                      @click="expandCluster(hour)">
                        <q-item-section>
                            <strong>{{ event.title }}</strong>
                            <span class="event-time">{{ event.startTime }}</span>
                        </q-item-section>
                    </q-item>
                </template>
                <template v-else>
                    <q-item class="event cluster" clickable @click="expandCluster(hour)">
                        <q-item-section>
                            <strong>{{ getScheduleForHour(hour).length }} events</strong>
                            <span class="event-time">Click to expand</span>
                        </q-item-section>
                    </q-item>
                </template>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
    schedule: {
        type: Array,
        required: true,
    },
});

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

const expandCluster = (hour: number) => {
    expandedClusters.value[hour] = !expandedClusters.value[hour];
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

    .event {
        position: relative;
        background-color: #1976D2;
        border-radius: 4px;
        padding: 4px;
        margin-bottom: 4px;
        /* Space between events */
        font-size: 12px;
        overflow: hidden;

        .event-time {
            display: block;
            font-size: 10px;
        }
    }

    .event.cluster {
        background-color: #ff9800;
        cursor: pointer;
        text-align: center;
    }
}
</style>
