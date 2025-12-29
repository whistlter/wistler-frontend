// src/api/auth.api.ts

import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
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
  return api.post<LoginResponse>("/auth/login", payload);
}

export async function logout(): Promise<void> {
  return api.post("/auth/logout");
}