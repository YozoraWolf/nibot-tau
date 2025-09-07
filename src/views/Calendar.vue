<template>
  <div class="calendar-root">
    <div class="calendar-header row items-center justify-between">
      <q-btn @click="prevMonth" class="c-btn" rounded flat>
        <q-icon name="arrow_back" />
      </q-btn>
      <h3 class="month-title">{{ currentMonth.format('MMMM YYYY') }}</h3>
      <q-btn @click="nextMonth" class="c-btn" rounded flat>
        <q-icon name="arrow_forward" />
      </q-btn>
    </div>
    <div class="calendar-weekdays row">
      <div v-for="weekday in weekdays" :key="weekday" class="calendar-weekday col">
        {{ weekday }}
      </div>
    </div>
    <div class="calendar-grid">
      <CalendarDay
        v-for="day in days"
        :key="day.format('YYYY-MM-DD')"
        :day="day"
        :isCurrentMonth="isCurrentMonth(day)"
        :items="getItemsForDay(day)"
        @click="handleDayClick(day)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import CalendarDay from '@/components/Calendar/CalendarDay.vue';
import { useScheduleStore } from '@/store/schedule';

const scheduleStore = useScheduleStore();
const currentMonth = ref(dayjs());
const days = ref<any[]>([]);
const router = useRouter();

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const generateDays = () => {
  const year: number = currentMonth.value.year();
  const month: number = currentMonth.value.month() + 1;
  days.value = generateCalendarGrid(year, month);
};

const generateCalendarGrid = (year: number, month: number) => {
  const firstDayOfMonth = dayjs(`${year}-${month}-01`);
  const startOfWeek = firstDayOfMonth.startOf('week');
  const totalDays = 42; // 6 weeks x 7 days
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
  if (!isCurrentMonth(day)) return;
  const selectedDate = day.format('YYYY-MM-DD');
  scheduleStore.setSelectedCurrentDate(selectedDate);
  router.push(`/calendar/${selectedDate}`);
};

// Placeholder: Replace with actual logic to get items for a day
const getItemsForDay = (day: any) => {
  // Example: return scheduleStore.getItemsForDate(day.format('YYYY-MM-DD'));
  return [];
};

onMounted(() => {
  generateDays();
});
</script>

<style lang="scss" scoped>
.calendar-root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  width: 100%;
  padding: 16px 0;
}

.month-title {
  flex: 1;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.calendar-weekdays {
  width: 100%;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
}

.calendar-weekday {
  flex: 1 1 0;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 120px;
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  gap: 2px;
  background: var(--q-color-surface);
}
</style>