// src/composables/useFacebookAuth.ts
import { ref } from 'vue';
import {
    initFacebookSdk,
    getFacebookUser,
    postImageToFacebook as postImage,
    clearFacebookToken,
    isFacebookConnected,
    saveFacebookToken
} from '@/utils/FacebookHelper';

export function useFacebookAuth() {
    const user = ref<null | {
        id: string;
        name?: string;
        email?: string;
        picture?: { data: { url: string } }
    }>(null);

    const loading = ref(false);
    const error = ref<null | string>(null);
    // Always check token presence for connected status
    const connected = ref(isFacebookConnected());

    // Watch for token changes to update connected status
    function updateConnected() {
        connected.value = isFacebookConnected();
    }

    // --------------------
    // Initialize SDK (CSP-safe)
    // --------------------
    async function initSdk() {
        loading.value = true;
        try {
            await initFacebookSdk();
            updateConnected();
            console.log('Facebook SDK loaded');
        } catch (err: any) {
            console.error('SDK init failed:', err);
            error.value = err.message || 'Failed to initialize Facebook SDK';
        } finally {
            loading.value = false;
        }
    }

    // --------------------
    // Login flow
    // --------------------
    async function login() {
        loading.value = true;
        error.value = null;

        try {
            // Step 1: Initialize the Facebook SDK
            await initSdk();

            // Step 2: Trigger the login popup
            await new Promise<void>((resolve, reject) => {
                FB.login((response) => {
                    if (response.authResponse) {
                        saveFacebookToken(response.authResponse.accessToken);
                        updateConnected();
                        resolve();
                    } else {
                        updateConnected();
                        reject(new Error('Facebook login failed or cancelled'));
                    }
                }, { scope: 'public_profile, pages_show_list' });
            });

            // Step 3: Fetch user info after login succeeds
            user.value = await getFacebookUser();
            updateConnected();
            console.log('User info loaded:', user.value);

        } catch (err: any) {
            console.error(err);
            error.value = err.message || 'Facebook login error';
            updateConnected();
        } finally {
            loading.value = false;
        }
    }

    // --------------------
    // Logout
    // --------------------
    function logout() {
        FB.logout(() => {
            clearFacebookToken();
            updateConnected();
            user.value = null;
        });
    }

    // --------------------
    // Post an image
    // --------------------
    async function postImageToFacebook(caption: string, file: File) {
        if (!isFacebookConnected()) {
            updateConnected();
            throw new Error('Not logged in');
        }
        return await postImage(caption, file);
    }

    return {
        user,
        loading,
        error,
        connected,
        initSdk,
        login,
        logout,
        postImageToFacebook,
    };
}
