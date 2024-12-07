<template>
    <div class="schedule-container q-pa-md q-gutter-sm">
      <!-- Time Column -->
      <div class="time-column">
        <div v-for="hour in hours" :key="hour" class="time-label">
          {{ formatHour(hour) }}
        </div>
      </div>
  
      <!-- Schedule Grid -->
      <div class="grid-column">
        <div v-for="hour in hours" :key="hour" class="time-slot">
          <q-item v-for="event in getEventsForHour(hour)" :key="event.id" class="event">
            <q-item-section>
              <strong>{{ event.title }}</strong>
              <span class="event-time">{{ event.startTime }} - {{ event.endTime }}</span>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  
  // Props: events passed from the parent component
  defineProps({
    events: {
      type: Array,
      default: () => [],
    },
  });
  
  // Generate hours for the day (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Format hour into 12-hour clock format
  const formatHour = (hour: number) => {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };
  
  // Get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventStart = parseTime(event.startTime);
      return Math.floor(eventStart) === hour;
    });
  };
  
  // Helper: Parse time into fractional hours
  const parseTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour + minute / 60;
  };
  </script>
  
  <style lang="scss" scoped>
  .schedule-container {
    display: flex;
    border: 1px solid #ddd;
    height: 100%;
    background-color: #fff;
  }
  
  .time-column {
    width: 80px;
    background-color: #f4f4f4;
    border-right: 1px solid #ddd;
  
    .time-label {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
    }
  }
  
  .grid-column {
    flex: 1;
    position: relative;
  
    .time-slot {
      height: 50px;
      border-bottom: 1px solid #ddd;
      position: relative;
    }
  
    .event {
      position: absolute;
      left: 5px;
      right: 5px;
      background-color: #1976D2;
      color: white;
      border-radius: 4px;
      padding: 4px;
      font-size: 12px;
      overflow: hidden;
  
      .event-time {
        display: block;
        font-size: 10px;
        color: #bbdefb;
      }
    }
  }
  </style>
  