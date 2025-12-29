// src/features/users/hooks/useUsers.ts
import type { CommunitiesApi } from '@/features/communities/types/community.types';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';

export interface User {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Inactive';
}

export interface PaginatedUsers {
    data: CommunitiesApi[];
    total: number;
    page: number;
    pageSize: number;
}

// GET all users with pagination
export function useCommunities(page: number, pageSize: number = 10) {
    return useGet<PaginatedUsers>(
        ['users', page.toString(), pageSize.toString()], // Convert to strings
        `/users?page=${page}&limit=${pageSize}`,
        {
            staleTime: 2 * 60 * 1000,
        }
    );
}

// GET single user
export function useCommunity(id: string) {
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
export function useCreateCommunity() {
    return usePost<User>('/users', {
        onSuccess: () => {
            console.log('User created successfully');
        },
    });
}

// UPDATE user
export function useUpdateCommunity(id: string) {
    return usePut<User>(`/users/${id}`, {
        onSuccess: () => {
            console.log('User updated successfully');
        },
    });
}

// DELETE user
export function useDeleteCommunity(id: string) {
    return useDelete(`/users/${id}`, {
        onSuccess: () => {
            console.log('User deleted successfully');
        },
    });
}