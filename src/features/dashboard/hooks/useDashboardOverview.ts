import { useGet } from '@/hooks/useApi';

export interface DashboardOverview {
    users: {
        total_users: number;
        active_users: string;
        banned_users: string;
        non_onboarded_users: string;
    };
    active_community_count: number;
    active_moment_count: number;
    active_comment_count: number;
}

export interface DashboardOverviewResponse {
    message: string;
    payload: {
        overview: DashboardOverview;
    };
    status: string;
}

export function useDashboardOverview() {
    return useGet<DashboardOverviewResponse>(
        ['dashboard-overview'],
        'admin/dashboard/overview',
        { staleTime: 60 * 1000 }
    );
}
