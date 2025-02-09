import { defineStore } from 'pinia';
import { BooruPost, BooruSearch } from '@/interfaces/Booru';
import { SocialMediaPost } from '@/interfaces/Post';

export const useBooruStore = defineStore('booru', {
    state: () => ({
        searchResults: [] as BooruPost[],
        socialMediaPosts: [] as SocialMediaPost[],
        selectedPost: {} as SocialMediaPost,
        loading: false,
    }),
    actions: {
        async searchPosts({ tags, nsfw, server, limit, page }: BooruSearch) {
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (tags) params.append(server.tag_param, tags);
                if (tags && nsfw) params.append('rating:explicit', tags);
                if (limit) params.append(server.limit_param, limit.toString());
                if (page) params.append(server.page_param, page.toString());
                const url = `${server.url}${server.api_access}?${params.toString()}`;
                const response = await fetch(url);
                const data = await response.json();

                this.searchResults = data.map((post: any) => ({
                    id: post[server.post_mappings.id],
                    tags: post[server.post_mappings.tags.general],
                    file_url: post[server.post_mappings.file_url],
                    preview_url: post[server.post_mappings.preview_url],
                    source: post[server.post_mappings.source],
                    artist: post[server.post_mappings.tags.artist],
                    score: post[server.post_mappings.score],
                    rating: post[server.post_mappings.rating],
                    width: post[server.post_mappings.width],
                    height: post[server.post_mappings.height],
                }));

                this.socialMediaPosts = this.searchResults.map((post) => ({
                    id: this.generateRandomId(),
                    title: "Title Here",
                    message: "Message Here",
                    bot: undefined,
                    sm_type: undefined,
                    timestamp: undefined,
                    booru_post: post,
                }));

                console.log('Fetched images', this.socialMediaPosts);

            } catch (error) {
                console.error('Failed to fetch images', error);
            } finally {
                this.loading = false;
            }
        },
        selectPost(post: SocialMediaPost) {
            this.selectedPost = post;
            console.log('Selected post', this.selectedPost);
        },
        generateRandomId(): number {
            return Math.floor(Math.random() * 1000);
        },
    },
    getters: {
        getSearchResults: (state) => state.searchResults,
        getSocialMediaPosts: (state) => state.socialMediaPosts,
        getSelectedPost: (state) => state.selectedPost,
        isLoading: (state) => state.loading,
    },
});