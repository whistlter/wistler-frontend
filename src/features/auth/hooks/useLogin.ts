// src/features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useLoginAction } from "../stores/auth.store";
import { login as loginApi, type LoginPayload, type LoginResponse } from "../api/auth.api";
import { setTokens } from "@/utils/storage";

export function useLogin() {
  const login = useLoginAction();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => loginApi(payload),

    onSuccess: (response: any) => {
      console.log("Login raw response:", response);

      const data = response.data || response;
      const payload = data.payload || data;

      // Look for tokens in various possible fields, including the new 'payload' nest
      const accessToken = payload.token || payload.accessToken || payload.access_token || data.accessToken;
      const refreshToken = payload.refreshToken || payload.refresh_token || data.refreshToken;
      const user = payload.user || data.user;

      console.log("Extracted login data:", {
        hasAccess: !!accessToken,
        hasRefresh: !!refreshToken,
        hasUser: !!user
      });

      if (accessToken) {
        // Persist tokens for API and Router
        setTokens(accessToken, refreshToken || "");

        // Update store state
        login({
          user: user || { id: 0, email: "", name: "User" },
          accessToken: accessToken,
        });

        console.log("Auth store updated successfully");
      } else {
        console.error("Login failed: No access token found in response. Checked nested keys:", Object.keys(data));
      }
    },
  });
}
