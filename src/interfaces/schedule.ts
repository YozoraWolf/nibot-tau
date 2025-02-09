
export enum Server {
    testbooru,
    danbooru,
    gelbooru,
};

export interface Schedule {
    [date: string]: Array<ScheduleItem>;
  }

export interface ScheduleItem {
    id: number;
    post_id: number;
    server_id: Server;
    title: string;
    timestamp: number;
}
