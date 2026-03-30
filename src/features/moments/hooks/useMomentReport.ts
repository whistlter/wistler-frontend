import { useQuery } from '@tanstack/react-query';
import type { MomentReportApi } from '../types/momentReport.types';

export interface MomentReportsResponse {
    message: string;
    payload: {
        reports: MomentReportApi[];
        meta: {
            count: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
        };
    };
    status: string;
}

const DUMMY_REPORTS: MomentReportApi[] = [
    {
        id: 1, reason: 'Harassment', createdAt: '2026-01-18T00:00:00Z',
        post: {
            id: 1, post: "I've been feeling really gutted from work lately, anyone else feel like quitting?",
            image: 'https://picsum.photos/seed/report1/468/180',
            likes_count: 53, comments_count: 12, flags_count: 4, reports_count: 2, reach_count: 1245, participants_count: 23,
            user: { id: 1, first_name: 'Noah', last_name: 'Brown', username: 'noahb', image: null, status: 'active' },
            moment: { id: 1, title: 'Not feeling work today', interest: { id: 5, title: 'Work and Career' } },
        },
        reporter: { id: 10, first_name: 'Samuel', last_name: 'Neale', username: 'samueln' },
    },
    {
        id: 2, reason: 'Spam', createdAt: '2026-01-18T00:00:00Z',
        post: {
            id: 2, post: "I've been feeling really quite fatigued from lately work...",
            image: 'https://picsum.photos/seed/report2/468/180',
            likes_count: 21, comments_count: 6, flags_count: 1, reports_count: 1, reach_count: 340, participants_count: 8,
            user: { id: 2, first_name: 'Louie', last_name: 'Dare', username: 'louied', image: null, status: 'active' },
            moment: { id: 2, title: 'Professional Growth', interest: { id: 2, title: 'Relationships' } },
        },
        reporter: { id: 10, first_name: 'Samuel', last_name: 'Neale', username: 'samueln' },
    },
    {
        id: 3, reason: 'Inappropriate Content', createdAt: '2026-01-18T00:00:00Z',
        post: {
            id: 3, post: "I've been feeling really annoyed from work lately, what should I do?",
            likes_count: 14, comments_count: 3, flags_count: 3, reports_count: 2, reach_count: 620, participants_count: 15,
            user: { id: 3, first_name: 'Ethan', last_name: 'Williams', username: 'ethanw', image: null, status: 'active' },
            moment: { id: 3, title: 'Clean Practices', interest: { id: 3, title: 'Fun & Light' } },
        },
        reporter: { id: 11, first_name: 'Noah', last_name: 'Brown', username: 'noahb' },
    },
    {
        id: 4, reason: 'Misinformation', createdAt: '2026-01-18T00:00:00Z',
        post: {
            id: 4, post: "I've been feeling really tired from work lately, anyone have tips?",
            image: 'https://picsum.photos/seed/report4/468/180',
            likes_count: 9, comments_count: 2, flags_count: 2, reports_count: 1, reach_count: 180, participants_count: 5,
            user: { id: 4, first_name: 'Manuel', last_name: 'Serra', username: 'manuels', image: null, status: 'active' },
            moment: { id: 4, title: 'Financial Stability', interest: { id: 4, title: 'Terminology' } },
        },
        reporter: { id: 12, first_name: 'Liam', last_name: 'Johnson', username: 'liamj' },
    },
    {
        id: 5, reason: 'Other', createdAt: '2026-01-18T00:00:00Z',
        post: {
            id: 5, post: "I've been feeling really exhausted from work lately, need advice.",
            image: 'https://picsum.photos/seed/report5/468/180',
            likes_count: 31, comments_count: 9, flags_count: 0, reports_count: 0, reach_count: 290, participants_count: 9,
            user: { id: 5, first_name: 'Liam', last_name: 'Johnson', username: 'liamj', image: null, status: 'active' },
            moment: { id: 5, title: 'Workplace Benefits', interest: { id: 5, title: 'Work & Career' } },
        },
        reporter: { id: 13, first_name: 'Oliver', last_name: 'Stern', username: 'olivers' },
    },
    {
        id: 6, reason: 'Harassment', createdAt: '2026-01-18T00:00:00Z',
        post: {
            id: 6, post: "Lately I've been feeling burdened from being an introvert at work...",
            image: 'https://picsum.photos/seed/report6/468/180',
            likes_count: 44, comments_count: 19, flags_count: 5, reports_count: 3, reach_count: 420, participants_count: 14,
            user: { id: 6, first_name: 'Oliver', last_name: 'Stern', username: 'olivers', image: null, status: 'active' },
            moment: { id: 1, title: 'Not feeling work today', interest: { id: 5, title: 'Work and Career' } },
        },
        reporter: { id: 14, first_name: 'Oliver', last_name: 'Thompson', username: 'olivert' },
    },
];

// GET all reports across all moments
export function useAllMomentReports(
    page: number,
    pageSize: number = 10,
    searchTerm?: string,
) {
    return useQuery<MomentReportsResponse>({
        queryKey: ['moments', 'reports', page.toString(), pageSize.toString(), searchTerm || ''],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 300));
            const filtered = DUMMY_REPORTS.filter((r) =>
                !searchTerm ||
                r.post?.post.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return {
                message: 'ok',
                status: 'ok',
                payload: {
                    reports: filtered.slice((page - 1) * pageSize, page * pageSize),
                    meta: {
                        count: filtered.length,
                        totalPages: Math.ceil(filtered.length / pageSize),
                        currentPage: page,
                        perPage: pageSize,
                    },
                },
            };
        },
        staleTime: 2 * 60 * 1000,
    });
}

// GET reports within a specific moment/topic
export function useMomentReports(
    momentId: string,
    page: number,
    pageSize: number = 10,
    searchTerm?: string,
) {
    return useQuery<MomentReportsResponse>({
        queryKey: ['moments', momentId, 'reports', page.toString(), pageSize.toString(), searchTerm || ''],
        queryFn: async () => {
            await new Promise((r) => setTimeout(r, 300));
            const filtered = DUMMY_REPORTS.filter((r) =>
                !searchTerm ||
                r.post?.post.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return {
                message: 'ok',
                status: 'ok',
                payload: {
                    reports: filtered.slice((page - 1) * pageSize, page * pageSize),
                    meta: {
                        count: filtered.length,
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
