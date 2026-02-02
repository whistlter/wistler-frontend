// src/features/users/hooks/useUsers.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import type { PaginatedUsers, PaginatedUserCommunities, ApiResponse, UserApi, SingleUserResponse } from '../types/user.types';

// GET all users with pagination and search
export function useUsers(page: number, pageSize: number = 30, searchTerm?: string, startDate?: string, endDate?: string, statusFilter?: string) {
  // Build query parameters
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchTerm && searchTerm.trim()) {
    params.append('search', searchTerm.trim());
  }

  if (startDate && startDate.trim()) {
    params.append('startDate', startDate.trim());
  }

  if (endDate && endDate.trim()) {
    params.append('endDate', endDate.trim());
  }

  if (statusFilter && statusFilter !== 'all') {
    params.append('status', statusFilter);
  }

  return useGet<PaginatedUsers>(
    ['users', page.toString(), pageSize.toString(), searchTerm || '', startDate || '', endDate || '', statusFilter || ''],
    `/admin/users?${params.toString()}`,
    {
      staleTime: 2 * 60 * 1000,
    }
  );
}

// GET single user
export function useUser(id: string | number) {
  return useGet<SingleUserResponse>(
    ['users', id.toString()],
    `/admin/users/${id}`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
}

// CREATE user
export function useCreateUser() {
  return usePost<ApiResponse<UserApi>, Partial<UserApi>>('/admin/users', {
    onSuccess: () => {
      console.log('User created successfully');
    },
  });
}

// UPDATE user
export function useUpdateUser(id: string | number) {
  return usePut<ApiResponse<UserApi>, Partial<UserApi>>(`/admin/users/${id}`, {
    onSuccess: () => {
      console.log('User updated successfully');
    },
  });
}

// DELETE user
export function useDeleteUser(id: string | number) {
  return useDelete(`/admin/users/${id}`, {
    onSuccess: () => {
      console.log('User deleted successfully');
    },
  });
}

// BLOCK/UNBLOCK user
// Endpoint: users/:userId/status/:status
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<unknown>, Error, { id: string | number; status: string }>({
    mutationFn: ({ id, status }) => api.patch<ApiResponse<unknown>>(`/admin/users/${id}/status/${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Specifically for the requested endpoint: users/7/status/blocked
export function useBlockUser() {
  const { mutateAsync } = useUpdateUserStatus();
  return {
    mutateAsync: (id: string | number) => mutateAsync({ id, status: 'blocked' })
  };
}

// Activate a blocked user: users/:userId/status/active
export function useActivateUser() {
  const { mutateAsync } = useUpdateUserStatus();
  return {
    mutateAsync: (id: string | number) => mutateAsync({ id, status: 'active' })
  };
}

// RESET password
// Endpoint: users/:userId/reset-password
export function useResetUserPassword() {
  return useMutation<ApiResponse<unknown>, Error, string | number>({
    mutationFn: (id: string | number) => api.patch<ApiResponse<unknown>>(`/admin/users/${id}/reset-password`),
    onSuccess: () => {
      console.log('User password reset successfully');
    },
  });
}

// GET user communities
export function useUserCommunities(userId: string | number, page: number, pageSize: number = 30, searchTerm?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchTerm && searchTerm.trim()) {
    params.append('search', searchTerm.trim());
  }

  return useGet<PaginatedUserCommunities>(
    ['users', userId.toString(), 'community', page.toString(), pageSize.toString(), searchTerm || ''],
    `/admin/users/${userId}/community?${params.toString()}`,
    {
      enabled: !!userId,
      staleTime: 2 * 60 * 1000,
    }
  );
}

// GET single user community (specific community for a user)
export function useUserCommunity(userId: string | number, communityId: string | number) {
  return useGet<SingleUserResponse>(
    ['users', userId.toString(), 'community', communityId.toString()],
    `/admin/users/${userId}/community/${communityId}`,
    {
      enabled: !!userId && !!communityId,
      staleTime: 5 * 60 * 1000,
    }
  );
}