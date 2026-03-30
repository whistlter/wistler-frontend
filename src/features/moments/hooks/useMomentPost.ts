import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGet } from '@/hooks/useApi';
import api from '@/lib/axios';
import type { MomentPostApi } from '../types/momentPost.types';

export interface MomentPostsResponse {
    message: string;
    payload: {
        comments: MomentPostApi[];
        meta: {
            count: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
        };
    };
    status: string;
}

export interface DeleteCommentResponse {
    message: string;
    status: string;
}

// GET all comments/posts across all moments
export function useAllMomentPosts(
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

    return useGet<MomentPostsResponse>(
        ['moments', 'comments', page.toString(), pageSize.toString(), searchTerm || '', startDate || '', endDate || '', status || ''],
        `admin/moments/comments?${params.toString()}`,
        { staleTime: 2 * 60 * 1000 }
    );
}

// GET comments/posts within a specific moment/topic
export function useMomentPosts(
    momentId: string,
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
        momentId,
    });

    if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (status && status !== 'all') params.append('status', status);

    return useGet<MomentPostsResponse>(
        ['moments', momentId, 'comments', page.toString(), pageSize.toString(), searchTerm || '', startDate || '', endDate || '', status || ''],
        `admin/moments/comments?${params.toString()}`,
        { enabled: !!momentId, staleTime: 2 * 60 * 1000 }
    );
}

// DELETE a comment/post by ID
export function useSoftDeleteMomentPost() {
    const queryClient = useQueryClient();
    return useMutation<DeleteCommentResponse, Error, string | number>({
        mutationFn: (id) => api.delete<DeleteCommentResponse>(`admin/moments/comment/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moments'] });
        },
    });
}
