import { defineStore } from 'pinia';
import { readTextFile, exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { appDataDir, BaseDirectory } from '@tauri-apps/api/path';
import Logger from '@/utils/logger';

enum Server {
    testbooru,
    danbooru,
    gelbooru,
};

interface Schedule {
    [date: string]: Array<ScheduleItem>;
  }

interface ScheduleItem {
    id: number;
    post_id: number;
    server_id: Server;
    title: string;
    timestamp: number;
}

// TODO: Transition to SQLite when finished with JSON
let schedulePath = "";


interface ScheduleState {
    schedule: Schedule;
    currentSelectedDate: string;
}

let logger: Logger;

export const useScheduleStore = defineStore('schedule', {
    state: (): ScheduleState => ({
        schedule: {},
        currentSelectedDate: '',
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
            console.log(this.schedule);
            return this.schedule;
        },

        createNewScheduleItem(date: string) : ScheduleItem {
            const id = Math.max(...this.schedule[date].map(item => item.id), 0) + 1;
            console.log('Creating new schedule item with id: ' + id);
            const newItem = {
                id,
                post_id: 0,
                server_id: Server.testbooru,
                title: '',
                timestamp: 0,
            };
            this.schedule[date] = [...this.schedule[date], newItem];
            logger.info('Created new schedule item:' + newItem);
            return newItem;
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

        setSelectedCurrentDate(date: string) {
            this.currentSelectedDate = date;
        }
    },
    getters: {
        getScheduleById: (state) => (date: string, id: number) : ScheduleItem | undefined => {
            return state.schedule[date].find(item => item.id === id);
        },

        getSchedulesByDate: (state) => (date: string) => {
            const dateSchedule = state.schedule[date];
            if (!dateSchedule) {
                return [];
            }
            return dateSchedule; 
        },

        getCurrentSelectedDate: (state) => () : string =>{
            return state.currentSelectedDate;
        }
    },
});