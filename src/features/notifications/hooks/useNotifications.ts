import { useGet } from '@/hooks/useApi';

export interface AdminNotification {
    id: number;
    user_id: number;
    title: string;
    desc: string;
    type: string;
    sub_type: string;
    object_id: number | null;
    community_id: number | null;
    relationShipId: number | null;
    is_read: boolean;
    has_performed_action: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export interface NotificationsResponse {
    message: string;
    payload: {
        adminNotifications: AdminNotification[];
    };
    status: string;
}

export function useNotifications() {
    return useGet<NotificationsResponse>(
        ['notifications'],
        'admin/dashboard/notifications',
        { staleTime: 30 * 1000 }
    );
}
