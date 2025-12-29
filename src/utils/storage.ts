// src/services/auth.storage.ts
const ACCESS_TOKEN = "authToken";
const REFRESH_TOKEN = "refreshToken";

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN, access);
  localStorage.setItem(REFRESH_TOKEN, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}