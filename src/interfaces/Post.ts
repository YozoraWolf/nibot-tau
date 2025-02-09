import { BooruPost } from "./Booru";
import { Bot } from "./Bot";

export interface SocialMediaPost {
    id: number;
    title: string;
    message: string;
    bot?: Bot,
    sm_type?: string;
    timestamp?: number;
    booru_post: BooruPost;
}