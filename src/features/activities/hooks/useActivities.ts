import { useGet } from '@/hooks/useApi';

export interface ActivityItem {
    id: number;
    user_id: number;
    userId: number;
    title: string;
    desc: string;
    type: string;
    sub_type: string;
    object_id: number | null;
    community_id: number | null;
    is_read: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ActivitiesResponse {
    message: string;
    payload: {
        activities: ActivityItem[];
        meta: {
            count: number;
            totalPages: number;
            currentPage: number;
            perPage: number;
        };
    };
    status: string;
}

export interface UseActivitiesParams {
    page: number;
    pageSize?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
}

export function useActivities({
    page,
    pageSize = 30,
    search,
    startDate,
    endDate,
    sort = 'all',
}: UseActivitiesParams) {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    // Only send search when the user has typed something
    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
        params.append('search', trimmedSearch);
    }

    // Only send sort when it's not "all" to avoid backend column mapping issues
    if (sort && sort !== 'all') {
        params.append('sort', sort);
    }

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return useGet<ActivitiesResponse>(
        ['activities', page.toString(), pageSize.toString(), search || '', startDate || '', endDate || '', sort],
        `admin/dashboard/activities?${params.toString()}`,
        { staleTime: 30 * 1000 }
    );
}
