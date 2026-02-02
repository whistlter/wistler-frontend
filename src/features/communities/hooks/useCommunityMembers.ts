// src/features/communities/hooks/useCommunityMembers.ts
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import type { CommunitiesMembersApi } from '../types/communityMember.types';

export interface PaginatedCommunityMembersResponse {
    message: string;
    payload: {
        members: CommunitiesMembersApi[];
        meta?: {
            total: number;
            page: number;
            pageSize: number;
        };
    };
    status: string;
}

// GET all members with pagination for a specific community
export function useCommunitiesMembers(communityId: string, page: number, pageSize: number = 10, searchTerm?: string) {
    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
    });

    if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
    }

    return useGet<PaginatedCommunityMembersResponse>(
        ['communities', communityId, 'members', page.toString(), pageSize.toString(), searchTerm || ''],
        `admin/community/${communityId}/members?${params.toString()}`,
        {
            enabled: !!communityId,
            staleTime: 2 * 60 * 1000,
        }
    );
}

// GET single member
export function useCommunityMember(id: string) {
    return useGet<CommunitiesMembersApi>(
        ['communities', 'members', id],
        `admin/communities/members/${id}`,
        {
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        }
    );
}

// CREATE member
export function useCreateCommunityMember() {
    return usePost<CommunitiesMembersApi>('admin/communities/members', {
        onSuccess: () => {
            console.log('Member created successfully');
        },
    });
}

// UPDATE member
export function useUpdateCommunityMember(id: string) {
    return usePut<CommunitiesMembersApi>(`admin/communities/members/${id}`, {
        onSuccess: () => {
            console.log('Member updated successfully');
        },
    });
}

// DELETE member
export function useDeleteCommunityMember(id: string) {
    return useDelete(`admin/communities/members/${id}`, {
        onSuccess: () => {
            console.log('Member deleted successfully');
        },
    });
}