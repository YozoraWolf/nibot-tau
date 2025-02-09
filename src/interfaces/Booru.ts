export interface BooruPost {
    id: number;
    tags: string;
    file_url: string;
    preview_url: string;
    source: string;
    artist: string;
    score: number;
    rating: string;
    width: number;
    height: number;
};

export interface BooruSearch {
    posts?: BooruPost[];
    limit?: number;
    page?: number;
    pages?: number;
    nsfw: boolean;
    server: BooruServer;
    tags: string;
    error?: string;
    success?: boolean;
}

export interface BooruServer {
    name: string;
    url: string;
    api_access: string;
    tag_param: string;
    limit_param: string;
    page_param: string;

    post_mappings: {
        id: string;
        tags: {
            general: string;
            artist: string;
            character: string;
            meta: string;
        };
        file_url: string;
        preview_url: string;
        sample_url: string;
        source: string;
        score: string;
        rating: string;
        width: string;
        height: string;
    }
}