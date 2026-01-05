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
export function useCommunities(page: number, pageSize: number = 30, searchTerm?: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
    }

    return useGet<CommunitiesResponse>(
        ['communities', page.toString(), pageSize.toString(), searchTerm || ''],
        `/communities?${params.toString()}`,
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
        queryFn: () => api.get<SingleCommunityResponse>(`/communities/${id}`),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// CREATE community
export function useCreateCommunity() {
    const queryClient = useQueryClient();
    return useMutation<SingleCommunityResponse, Error, any>({
        mutationFn: (data: any) => {
            console.log('useCreateCommunity data:', data);

            // Check if any value is a File or Blob
            const hasFile = Object.values(data).some(
                (val) => val instanceof File || val instanceof Blob
            );

            console.log('Has file for upload:', hasFile);

            if (hasFile) {
                const formData = new FormData();
                Object.keys(data).forEach((key) => {
                    if (data[key] !== null && data[key] !== undefined) {
                        formData.append(key, data[key]);
                    }
                });

                // Debug log FormData entries
                for (const pair of (formData as any).entries()) {
                    console.log(`FormData: ${pair[0]} =`, pair[1]);
                }

                return api.post<SingleCommunityResponse>('/communities', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            return api.post<SingleCommunityResponse>('/communities', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}

// UPDATE community
export function useUpdateCommunity(id: string) {
    const queryClient = useQueryClient();
    return useMutation<SingleCommunityResponse, Error, any>({
        mutationFn: (data: any) => {
            console.log('useUpdateCommunity data:', data);

            const hasFile = Object.values(data).some(
                (val) => val instanceof File || val instanceof Blob
            );

            if (hasFile) {
                const formData = new FormData();
                Object.keys(data).forEach((key) => {
                    if (data[key] !== null && data[key] !== undefined) {
                        formData.append(key, data[key]);
                    }
                });

                return api.put<SingleCommunityResponse>(`/communities/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            return api.put<SingleCommunityResponse>(`/communities/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}

// DELETE community
export function useDeleteCommunity(id: string) {
    const queryClient = useQueryClient();
    return useDelete(`/communities/${id}`, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}