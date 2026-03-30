import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MomentMemberApi } from '../types/momentMember.types';

export interface MomentMembersResponse {
    message: string;
    payload: {
        members: MomentMemberApi[];
        meta: {
            count: number;
            total: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
        };
    };
    status: string;
}

const DUMMY_MEMBERS: MomentMemberApi[] = [
    {
        id: 1,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 1, first_name: 'Liam', last_name: 'Johnson', username: 'liamj', image: null },
    },
    {
        id: 2,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 2, first_name: 'Emma', last_name: 'Carter', username: 'emmac', image: null },
    },
    {
        id: 3,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 3, first_name: 'Sophia', last_name: 'Lee', username: 'sophial', image: null },
    },
    {
        id: 4,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 4, first_name: 'Noah', last_name: 'Smith', username: 'noahs', image: null },
    },
    {
        id: 5,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 5, first_name: 'Ava', last_name: 'Brown', username: 'avab', image: null },
    },
    {
        id: 6,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 6, first_name: 'Oliver', last_name: 'Davis', username: 'oliverd', image: null },
    },
    {
        id: 7,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 7, first_name: 'Isabella', last_name: 'Morgan', username: 'isabellam', image: null },
    },
    {
        id: 8,
        posts_count: 12,
        reports_count: 0,
        createdAt: '2026-01-12T00:00:00Z',
        user: { id: 8, first_name: 'Alex', last_name: 'Morgan', username: 'alexm', image: null },
    },
];

// GET members within a specific moment/topic
export function useMomentMembers(
    momentId: string,
    page: number,
    pageSize: number = 10,
    searchTerm?: string,
) {
    return useQuery<MomentMembersResponse>({
        queryKey: ['moments', momentId, 'members', page.toString(), pageSize.toString(), searchTerm || ''],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 300));
            const filtered = DUMMY_MEMBERS.filter((m) =>
                !searchTerm ||
                `${m.user?.first_name} ${m.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return {
                message: 'ok',
                status: 'ok',
                payload: {
                    members: filtered.slice((page - 1) * pageSize, page * pageSize),
                    meta: {
                        count: filtered.length,
                        total: filtered.length,
                        totalPages: Math.ceil(filtered.length / pageSize),
                        currentPage: page,
                        perPage: pageSize,
                    },
                },
            };
        },
        enabled: !!momentId,
        staleTime: 2 * 60 * 1000,
    });
}

// REMOVE a user from a moment (no-op for dummy)
export function useRemoveUserFromMoment() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, { momentId: string; userId: number | string }>({
        mutationFn: async () => {
            await new Promise((r) => setTimeout(r, 500));
            return { message: 'ok' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moments'] });
        },
    });
}
