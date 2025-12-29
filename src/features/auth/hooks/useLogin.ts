// src/features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useLoginAction } from "../stores/auth.store";
import api from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "../api/auth.api";
import { setTokens } from "@/utils/storage";

export function useLogin() {
  const login = useLoginAction();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      api.post<LoginResponse>("/auth/login", payload),

    onSuccess: (data) => {
      // Persist tokens for API and Router
      setTokens(data.accessToken, data.refreshToken);

      // Update store state
      login({
        user: data.user,
        accessToken: data.accessToken,
      });
    },
  });
}