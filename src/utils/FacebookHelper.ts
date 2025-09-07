// src/utils/facebook.ts

// Extend the Window interface to include fbAsyncInit
declare global {
  interface Window {
    fbAsyncInit?: () => void;
  }
}

// --------------------
// Local storage helpers
// --------------------
const TOKEN_KEY = 'fb_access_token';

export function isFacebookConnected(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function saveFacebookToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getFacebookToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearFacebookToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// --------------------
// SDK initialization
// --------------------
export function initFacebookSdk(): Promise<FB.AuthResponse | null> {
  return new Promise((resolve, reject) => {
    // If FB SDK already loaded, just resolve
    if (window.FB) {
      window.FB.getLoginStatus(({ authResponse }) => resolve(authResponse ?? null));
      return;
    }

    // Define fbAsyncInit dynamically
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v21.0',
      });

      FB.getLoginStatus(({ authResponse }) => {
        if (authResponse?.accessToken) {
          localStorage.setItem('fb_access_token', authResponse.accessToken);
        }
        resolve(authResponse ?? null);
      });
    };

    // Dynamically inject the SDK script
    const id = 'facebook-jssdk';
    if (!document.getElementById(id)) {
      const js = document.createElement('script');
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      js.onload = () => {
        console.log('Facebook SDK loaded dynamically');
      };
      js.onerror = (err) => {
        reject(new Error('Failed to load Facebook SDK'));
      };
      document.head.appendChild(js);
    }
  });
}


// --------------------
// Graph API helpers
// --------------------
interface FacebookUser {
  id: string;
  name?: string;
  email?: string;
  picture?: { data: { url: string } };
}

export async function getFacebookUser(): Promise<FacebookUser> {
  const accessToken = getFacebookToken();
  if (!accessToken) throw new Error('Not connected to Facebook');

  const resp = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=id,name,email,picture&access_token=${accessToken}`
  );
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);

  return data as FacebookUser;
}

export async function postImageToFacebook(
  caption: string,
  file: File
): Promise<{ id: string }> {
  const accessToken = getFacebookToken();
  if (!accessToken) throw new Error('Not connected to Facebook');

  try {
    const { id: userId } = await getFacebookUser();

    // Ensure file is a File instance and not undefined/null
    if (!(file instanceof File)) {
      throw new Error('No file selected or invalid file');
    }

    console.log('Uploading file to Facebook:', file.name, file.size, file.type);

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('access_token', accessToken);
    formData.append('source', file, file.name);
    // Make the post visible only to the user
    formData.append('privacy', JSON.stringify({ value: 'SELF' }));

    // Use /me/photos endpoint for user uploads (publish_actions is deprecated)
    const resp = await fetch(
      `https://graph.facebook.com/v21.0/me/photos`,
      { method: 'POST', body: formData }
    );

    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);

    return { id: data.id };
  } catch (err) {
    console.error('Facebook post failed:', err);
    throw err;
  }
}

export async function getFacebookPages(): Promise<{ id: string; name: string }[]> {
  const accessToken = getFacebookToken();
  if (!accessToken) throw new Error('Not connected to Facebook');

  const resp = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name&access_token=${accessToken}`
  );
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);

  // Always include "My Timeline" as the first option
  return [{ id: 'me', name: 'My Timeline' }, ...(data.data || [])];
}
