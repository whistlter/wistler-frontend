// src/features/communities/hooks/useCommunityMembers.ts
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import type { CommunitiesMembersApi } from '../types/communityMember.types';

export interface PaginatedCommunityMembers {
    data: CommunitiesMembersApi[];
    total: number;
    page: number;
    pageSize: number;
}

// GET all members with pagination
export function useCommunitiesMembers(page: number, pageSize: number = 10, searchTerm?: string) {
    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
    });

    if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
    }

    return useGet<PaginatedCommunityMembers>(
        ['communities', 'members', page.toString(), pageSize.toString(), searchTerm || ''],
        `/communities/members?${params.toString()}`,
        {
            staleTime: 2 * 60 * 1000,
        }
    );
}

// GET single member
export function useCommunityMember(id: string) {
    return useGet<CommunitiesMembersApi>(
        ['communities', 'members', id],
        `/communities/members/${id}`,
        {
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
        }
    );
}

// CREATE member
export function useCreateCommunityMember() {
    return usePost<CommunitiesMembersApi>('/communities/members', {
        onSuccess: () => {
            console.log('Member created successfully');
        },
    });
}

// UPDATE member
export function useUpdateCommunityMember(id: string) {
    return usePut<CommunitiesMembersApi>(`/communities/members/${id}`, {
        onSuccess: () => {
            console.log('Member updated successfully');
        },
    });
}

// DELETE member
export function useDeleteCommunityMember(id: string) {
    return useDelete(`/communities/members/${id}`, {
        onSuccess: () => {
            console.log('Member deleted successfully');
        },
    });
}