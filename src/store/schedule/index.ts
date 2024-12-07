import { defineStore } from 'pinia';
import { readTextFile, exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { appDataDir, BaseDirectory } from '@tauri-apps/api/path';
import Logger from '@/utils/logger';

const SERVER = {
    testbooru: 0,
    danbooru: 1,
    gelbooru: 2,
} as const;

interface Schedule {
    [date: string]: Array<ScheduleItem>;
  }

interface ScheduleItem {
    id: number;
    post_id: number;
    server_id: typeof SERVER;
    title: string;
    timestamp: string;
}

let schedulePath = "";


interface ScheduleState {
    schedule: Schedule;
}

let logger: Logger;

export const useScheduleStore = defineStore('schedule', {
    state: (): ScheduleState => ({
        schedule: {},
    }),
    actions: {
        async init() : Promise<void> {
            console.log('init');
            try {
                logger = new Logger("ScheduleStore");
                await logger.init();
                console.log("APPDATA: " + (await appDataDir()));
                schedulePath = "schedule.json";
                console.log(schedulePath);

                if(!(await exists(schedulePath, { baseDir: BaseDirectory.AppData }))) {
                    //logger.warn('Schedule file does not exist, creating new file');
                    console.log('Schedule file does not exist, creating new file');
                    await writeTextFile(schedulePath, JSON.stringify({}, null, 2), {
                        append: false,
                        baseDir: BaseDirectory.AppData,
                    });
                }
                console.log('Schedule file exists');
                const scheduleFile = await readTextFile(schedulePath, {
                    baseDir: BaseDirectory.AppData,
                });
                this.schedule = scheduleFile ? JSON.parse(scheduleFile) : {};
                console.log(this.schedule);
                logger.debug('Schedule loaded  from: ' + schedulePath);
            } catch (error: any) {
                logger.error('Failed to load schedule:', error);
            }
        },

        async loadSchedule() : Promise<Schedule> {
            if (!this.schedule || Object.keys(this.schedule).length === 0) {
                await this.init();
            }
            return this.schedule;
        },

        addScheduleItem(date: string, item: ScheduleItem) {
            this.schedule[date] = [...this.schedule[date], item];
            logger.info('Added schedule item:' + item);
        },

        removeScheduleItem(date: string, id: number) {
            this.schedule[date] = this.schedule[date].filter(item => item.id !== id);
        },
        
        async saveSchedule() {
            const scheduleFile = JSON.stringify(this.schedule, null, 2);
            try {
                await writeTextFile(schedulePath, scheduleFile, {
                    baseDir: BaseDirectory.AppData,
                });
            } catch (error: any) {
                logger.error('Failed to save schedule:', error);
            }
        },

        // File Specific

        getScheduleById(date: string, id: number) {
            return this.schedule[date].find(item => item.id === id);
        },

        getSchedulesByDate(date: string) {
            const dateSchedule = this.schedule[date];
            if (!dateSchedule) {
                return [];
            }
            return dateSchedule; 
        },

    },
});