// src/features/users/hooks/useUsers.ts
import type { UserApi } from '../types/user.types';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface PaginatedUsers {
  data: UserApi[];
  total: number;
  page: number;
  pageSize: number;
}

// GET all users with pagination and search
export function useUsers(page: number, pageSize: number = 10, searchTerm?: string) {
  // Build query parameters
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
  });

  if (searchTerm && searchTerm.trim()) {
    params.append('search', searchTerm.trim());
  }

  return useGet<PaginatedUsers>(
    ['users', page.toString(), pageSize.toString(), searchTerm || ''], // Add searchTerm to cache key
    `/users?${params.toString()}`,
    {
      staleTime: 2 * 60 * 1000,
    }
  );
}

// GET single user
export function useUser(id: string) {
  return useGet<User>(
    ['users', id],
    `/users/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes for detail data
    }
  );
}

// CREATE user
export function useCreateUser() {
  return usePost<User>('/users', {
    onSuccess: () => {
      console.log('User created successfully');
    },
  });
}

// UPDATE user
export function useUpdateUser(id: string) {
  return usePut<User>(`/users/${id}`, {
    onSuccess: () => {
      console.log('User updated successfully');
    },
  });
}

// DELETE user
export function useDeleteUser(id: string) {
  return useDelete(`/users/${id}`, {
    onSuccess: () => {
      console.log('User deleted successfully');
    },
  });
}