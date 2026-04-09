import { useGet } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

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

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return async (id: number) => {
        await api.patch(`admin/dashboard/notifications/${id}/true`);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();
    return async () => {
        await api.patch('admin/dashboard/notifications/all/true');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };
}
