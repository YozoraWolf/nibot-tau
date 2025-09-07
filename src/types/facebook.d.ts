export {};

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB: typeof FB;
  }

  namespace FB {
    interface AuthResponse {
      accessToken: string;
      userID: string;
      expiresIn: number;
      signedRequest: string;
      reauthorize_required_in?: number;
    }

    interface LoginStatusResponse {
      status: 'connected' | 'not_authorized' | 'unknown';
      authResponse: AuthResponse | null;
    }

    interface InitParams {
      appId: string;
      cookie?: boolean;
      xfbml?: boolean;
      version: string;
    }

    function init(params: InitParams): void;
    function getLoginStatus(callback: (response: LoginStatusResponse) => void): void;
    function login(
      callback: (response: LoginStatusResponse) => void,
      options?: { scope: string }
    ): void;
    function logout(callback?: () => void): void;
    function api(
      path: string,
      method: 'get' | 'post' | 'delete' | undefined,
      params: Record<string, any> | undefined,
      callback: (response: any) => void
    ): void;
  }
}
