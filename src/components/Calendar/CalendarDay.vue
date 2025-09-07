<template>
    <div class="calendar-day" :class="{ 'not-current': !isCurrentMonth }" @click="$emit('click')">
        <div class="calendar-day-header">
            <span>{{ day.date() }}</span>
        </div>
        <div class="calendar-day-items">
            <CalendarItem v-for="item in items" :key="item.id" :item="item" />
        </div>
        <CalendarMenu v-model="menu" :context="'day'" :item="item" />
    </div>
</template>

<script setup lang="ts">
import CalendarItem from './CalendarItem.vue';
import CalendarMenu from './CalendarMenu.vue';

defineProps<{
    day: any,
    isCurrentMonth: boolean,
    items: any[]
}>();
</script>

<style scoped>
.calendar-day {
    min-height: 100px;
    background: #fff;
    border: 1px solid #eee;
    padding: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: background 0.2s;
}

.calendar-day.not-current {
    background: #f5f5f5;
    color: #bbb;
    cursor: default;
}

.calendar-day-header {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 4px;
}

.calendar-day-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
