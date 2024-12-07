import { defineStore } from 'pinia';

export const useBooruStore = defineStore('booru', {
    state: () => ({
        images: [] as string[],
        loading: false,
    }),
    actions: {
        async fetchImages() {
            this.loading = true;
            try {
                // Replace with your API call
                const response = await fetch('https://api.example.com/images');
                const data = await response.json();
                this.images = data;
            } catch (error) {
                console.error('Failed to fetch images', error);
            } finally {
                this.loading = false;
            }
        },
    },
});