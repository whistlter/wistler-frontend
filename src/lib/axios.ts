// src/lib/axios.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';

const API_BASE_URL = env.VITE_API_BASE_URL;

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}auth/refresh`, { refreshToken });

        const { accessToken } = response.data;
        localStorage.setItem('authToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Extract the backend error message and set it on error.message
    // so every catch block gets the real message via error.message
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
      error.message = backendMessage;
    }

    return Promise.reject(error);
  }
);

// Base API service
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then(res => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config).then(res => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then(res => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then(res => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then(res => res.data),

  upload: <T = unknown>(url: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / (e.total || 1))),
    }).then(res => res.data);
  },
};

export default api;





