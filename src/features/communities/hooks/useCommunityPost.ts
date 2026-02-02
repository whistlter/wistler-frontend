// src/features/communities/hooks/useCommunityPost.ts
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CommunitiesPostApi } from '../types/communityPost.types';

export interface PaginatedCommunityPostsResponse {
    message: string;
    payload: {
        posts: CommunitiesPostApi[];
        meta?: {
            count: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
        };
    };
    status: string;
}

// GET all posts with pagination for a specific community
export function useCommunitiesPost(
    communityId: string,
    page: number,
    pageSize: number = 10,
    searchTerm?: string,
    startDate?: string,
    endDate?: string,
    status?: string
) {
    // Build query parameters
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

    if (status) {
        params.append('status', status);
    }

    return useGet<PaginatedCommunityPostsResponse>(
        ['communities', communityId, 'posts', page.toString(), pageSize.toString(), searchTerm || '', startDate || '', endDate || '', status || ''],
        `admin/community/${communityId}/posts?${params.toString()}`,
        {
            enabled: !!communityId,
            staleTime: 2 * 60 * 1000,
        }
    );
}

// GET single post
export function useCommunityPost(id: string) {
    return useGet<CommunitiesPostApi>(
        ['communities', 'posts', id],
        `/communities/posts/${id}`,
        {
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        }
    );
}

// CREATE post
export function useCreateCommunityPost() {
    return usePost<CommunitiesPostApi>('/communities/posts', {
        onSuccess: () => {
            console.log('Post created successfully');
        },
    });
}

// UPDATE post
export function useUpdateCommunityPost(id: string) {
    return usePut<CommunitiesPostApi>(`/communities/posts/${id}`, {
        onSuccess: () => {
            console.log('Post updated successfully');
        },
    });
}

// DELETE post
export function useDeleteCommunityPost(id: string) {
    return useDelete(`/communities/posts/${id}`, {
        onSuccess: () => {
            console.log('Post deleted successfully');
        },
    });
}

// Soft delete post: admin/community/posts/:id?kind=soft
export function useSoftDeletePost() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, number | string>({
        mutationFn: (postId) => api.delete(`admin/community/posts/${postId}?kind=soft`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['communities'] });
        },
    });
}