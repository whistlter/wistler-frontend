// src/features/communities/hooks/useCommunity.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useGet, useDelete } from '@/hooks/useApi';
import type { CommunitiesApi } from '../types/community.types';

export interface CommunitiesResponse {
    message: string;
    payload: {
        data: CommunitiesApi[];
        total: number;
        page: number;
        pageSize: number;
    };
    status: string;
}

// GET all communities with pagination
export function useCommunities(
    page: number,
    pageSize: number = 30,
    searchTerm?: string,
    startDate?: string,
    endDate?: string,
    status?: string
) {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
    }

    if (startDate) {
        params.append('startDate', startDate);
    }

    if (endDate) {
        params.append('endDate', endDate);
    }

    if (status && status !== 'all') {
        params.append('status', status);
    }

    return useGet<CommunitiesResponse>(
        ['communities', page.toString(), pageSize.toString(), searchTerm || '', startDate || '', endDate || '', status || ''],
        `admin/communities?${params.toString()}`,
        {
            staleTime: 2 * 60 * 1000,
        }
    );
}

export interface SingleCommunityResponse {
    message: string;
    payload: {
        community: CommunitiesApi;
    };
    status: string;
}

// GET single community
export function useCommunity(id: string) {
    return useQuery<SingleCommunityResponse>({
        queryKey: ['communities', id],
        queryFn: () => api.get<SingleCommunityResponse>(`admin/community/${id}`),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// CREATE community payload type
export interface CreateCommunityPayload {
    image?: File;
    title: string;
    desc: string;
    interest_id: string; // comma-separated IDs like "7,5"
    visibility: 'private' | 'public';
    is_safe_space: 'yes' | 'no';
    is_member_screening: 'yes' | 'no';
    can_post_anonymously: 'yes' | 'no';
    user_id: string;
}

// CREATE community
export function useCreateCommunity() {
    const queryClient = useQueryClient();
    return useMutation<SingleCommunityResponse, Error, CreateCommunityPayload>({
        mutationFn: (data: CreateCommunityPayload) => {
            const formData = new FormData();

            // Append all fields to FormData
            if (data.image) {
                formData.append('image', data.image);
            }
            formData.append('title', data.title);
            formData.append('desc', data.desc);
            formData.append('interest_id', data.interest_id);
            formData.append('visibility', data.visibility);
            formData.append('is_safe_space', data.is_safe_space);
            formData.append('is_member_screening', data.is_member_screening);
            formData.append('can_post_anonymously', data.can_post_anonymously);
            formData.append('user_id', data.user_id);

            return api.post<SingleCommunityResponse>('admin/community/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}

// UPDATE community payload type (same as create but all fields optional except what's being updated)
export interface UpdateCommunityPayload {
    image?: File;
    title?: string;
    desc?: string;
    interest_id?: string;
    visibility?: 'private' | 'public';
    is_safe_space?: 'yes' | 'no';
    is_member_screening?: 'yes' | 'no';
    can_post_anonymously?: 'yes' | 'no';
    user_id?: string;
}

// UPDATE community
export function useUpdateCommunity(id: string) {
    const queryClient = useQueryClient();
    return useMutation<SingleCommunityResponse, Error, UpdateCommunityPayload>({
        mutationFn: (data: UpdateCommunityPayload) => {
            const formData = new FormData();

            // Append all fields to FormData
            if (data.image) {
                formData.append('image', data.image);
            }
            if (data.title) {
                formData.append('title', data.title);
            }
            if (data.desc) {
                formData.append('desc', data.desc);
            }
            if (data.interest_id) {
                formData.append('interest_id', data.interest_id);
            }
            if (data.visibility) {
                formData.append('visibility', data.visibility);
            }
            if (data.is_safe_space) {
                formData.append('is_safe_space', data.is_safe_space);
            }
            if (data.is_member_screening) {
                formData.append('is_member_screening', data.is_member_screening);
            }
            if (data.can_post_anonymously) {
                formData.append('can_post_anonymously', data.can_post_anonymously);
            }
            if (data.user_id) {
                formData.append('user_id', data.user_id);
            }

            return api.post<SingleCommunityResponse>(`user/community/edit/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}

// DELETE community
export function useDeleteCommunity(id: string) {
    const queryClient = useQueryClient();
    return useDelete(`admin/communities/${id}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}

// TOGGLE community status
// Endpoint: admin/community/:id/toggle-status/:status
export function useToggleCommunityStatus() {
    const queryClient = useQueryClient();
    return useMutation<SingleCommunityResponse, Error, { id: string | number; status: string }>({
        mutationFn: ({ id, status }) => api.patch<SingleCommunityResponse>(`/admin/community/${id}/toggle-status/${status}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}

// Suspend community: admin/community/:id/toggle-status/suspended
export function useSuspendCommunity() {
    const { mutateAsync } = useToggleCommunityStatus();
    return {
        mutateAsync: (id: string | number) => mutateAsync({ id, status: 'in-active' })
    };
}

// Activate community: admin/community/:id/toggle-status/active
export function useActivateCommunity() {
    const { mutateAsync } = useToggleCommunityStatus();
    return {
        mutateAsync: (id: string | number) => mutateAsync({ id, status: 'active' })
    };
}

// Soft delete community: admin/community/:id?kind=soft
export function useSoftDeleteCommunity() {
    const queryClient = useQueryClient();
    return useMutation<SingleCommunityResponse, Error, string | number>({
        mutationFn: (id) => api.delete<SingleCommunityResponse>(`admin/community/${id}?kind=soft`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}