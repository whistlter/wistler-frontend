import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGet } from '@/hooks/useApi';
import api from '@/lib/axios';
import type { MomentApi } from '../types/moment.types';

export interface MomentsResponse {
    message: string;
    payload: {
        moments: MomentApi[];
        meta: {
            count: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
        };
    };
    status: string;
}

export interface SingleMomentResponse {
    message: string;
    payload: {
        moment: MomentApi;
        meta: Record<string, unknown>;
    };
    status: string;
}

export interface MomentStatResponse {
    message: string;
    status: string;
    payload: {
        momentCommentsCount: number;
        momentCommentsFlaggedCount: number;
        momentUsersCount: number;
    };
}

export interface DeleteMomentResponse {
    message: string;
    status: string;
}

export interface MomentStatsResponse {
    message: string;
    payload: {
        momentsCount: number;
        momentCommentsCount: number;
        momentUsersCount: number;
        momentFlagged: number;
    };
    status: string;
}

// GET all moments/topics with pagination
export function useMoments(
    page: number,
    pageSize: number = 10,
    searchTerm?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
) {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (status && status !== 'all') params.append('status', status);

    return useGet<MomentsResponse>(
        ['moments', page.toString(), pageSize.toString(), searchTerm || '', startDate || '', endDate || '', status || ''],
        `admin/moments?${params.toString()}`,
        { staleTime: 2 * 60 * 1000 }
    );
}

// GET single moment/topic by ID
export function useMoment(id: string) {
    return useGet<SingleMomentResponse>(
        ['moments', id],
        `admin/moments/${id}`,
        { enabled: !!id, staleTime: 5 * 60 * 1000 }
    );
}

// GET stats for a specific moment/topic
export function useMomentStat(momentId: string) {
    return useGet<MomentStatResponse>(
        ['moment-stat', momentId],
        `admin/moments/stat/${momentId}`,
        { enabled: !!momentId, staleTime: 5 * 60 * 1000 }
    );
}

// DELETE moment/topic
export function useSoftDeleteMoment() {
    const queryClient = useQueryClient();
    return useMutation<DeleteMomentResponse, Error, string | number>({
        mutationFn: (id) => api.delete<DeleteMomentResponse>(`admin/moments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moments'] });
        },
    });
}

// Suspend/Activate — no endpoints provided yet, kept as stubs
export function useSuspendMoment() {
    return { mutateAsync: async (id: string | number) => { return id; } };
}

export function useActivateMoment() {
    return { mutateAsync: async (id: string | number) => { return id; } };
}

// Global moment stats
export function useMomentStats() {
    return useGet<MomentStatsResponse>(
        ['moment-stats'],
        'admin/moments/stat',
        { staleTime: 2 * 60 * 1000 }
    );
}
