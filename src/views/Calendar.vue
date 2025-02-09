<template>
  <div class="calendar">
    <div class="calendar-header row flex-center">
      <q-btn @click="prevMonth" class="q-mx-md c-btn" rounded flat>
        <q-icon name="arrow_back" />
      </q-btn>
      <transition name="fade" mode="out-in">
        <h3 key="currentMonth" style="width: 400px" class="flex-center text-center">{{ currentMonth.format('MMMM YYYY')
          }}</h3>
      </transition> <q-btn @click="nextMonth" class="q-mx-md c-btn" rounded flat>
        <q-icon name="arrow_forward" />
      </q-btn>
    </div>
    <div class="calendar-grid">
      <q-btn v-for="day in days" :key="day.format('YYYY-MM-DD')"
        :class="`calendar-day ${!isCurrentMonth(day) ? 'disabled' : ''}`" flat rounded @click="handleDayClick(day)">
        {{ day.date() }}
    </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

import { useScheduleStore } from '@/store/schedule';

const scheduleStore = useScheduleStore();

const currentMonth = ref(dayjs());
const days = ref();
const router = useRouter();

const generateDays = () => {
  const year: number = currentMonth.value.year();
  const month: number = currentMonth.value.month() + 1;
  days.value = generateCalendarGrid(year, month);
};

const generateCalendarGrid = (year: number, month: number) => {
  const firstDayOfMonth = dayjs(`${year}-${month}-01`);
  const startOfWeek = firstDayOfMonth.startOf('week');
  const totalDays = 42; // Standard 6x7 grid
  return Array.from({ length: totalDays }, (_, i) => startOfWeek.add(i, 'day'));
};

const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month');
  generateDays();
};

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month');
  generateDays();
};

const isCurrentMonth = (day: any) => {
  return day.isSame(currentMonth.value, 'month');
};

const handleDayClick = (day: any) => {
  if (!isCurrentMonth(day)) return; // Disable clicks for non-current month days
  const selectedDate = day.format('YYYY-MM-DD');
  scheduleStore.setSelectedCurrentDate(selectedDate);
  router.push(`/calendar/${selectedDate}`);
};

onMounted(() => {
  generateDays();
});
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-header {
  margin-bottom: 10px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.calendar-day.disabled {
  cursor: not-allowed;
}

.calendar-day:hover:not(.disabled) {
  background-color: var(--q-color-surface-hover);
}


.c-btn {
  width: auto;
  font-size: large;
  height: 50px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>