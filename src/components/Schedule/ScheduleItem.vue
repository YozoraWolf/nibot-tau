<template>
    <q-item :clickable="clickable" @click="handleClick" class="event">
        <q-item-section>
            <strong>{{ event.title }}</strong>
            <span class="event-time">{{ event.startTime }}</span>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    event: Object,
    clickable: Boolean,
    hour: Number
});
</script>

<style lang="scss" scoped>
.event {
    width: 150px;
    height: 50px;
    
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
</style>