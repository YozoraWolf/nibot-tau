export interface Bot {
    id: string,
    name: string,
    description: string,
    system_prompt: string,
    tags: string[],
    created_at: string,
    updated_at: string,
    avatar: string,
    note: string
}