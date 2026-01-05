// src/features/communities/hooks/useCommunityPost.ts
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import type { CommunitiesPostApi } from '../types/communityPost.types';

export interface PaginatedCommunityPosts {
    data: CommunitiesPostApi[];
    total: number;
    page: number;
    pageSize: number;
}

// GET all posts with pagination
export function useCommunitiesPost(page: number, pageSize: number = 10, searchTerm?: string) {
    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
    });

    if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
    }

    return useGet<PaginatedCommunityPosts>(
        ['communities', 'posts', page.toString(), pageSize.toString(), searchTerm || ''],
        `/communities/posts?${params.toString()}`,
        {
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