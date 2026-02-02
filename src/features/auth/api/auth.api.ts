// src/api/auth.api.ts

import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
  returnUrl: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return api.post<LoginResponse>("login", payload);
}

export async function logout(): Promise<void> {
  return api.post("logout");
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  return api.post("admin/forget-password/check-email", payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  return api.post("admin/forget-password/change-password", payload);
}