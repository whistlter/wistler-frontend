import { useState } from 'react';
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { AppIcons } from "@/constants/constant";
import { CheckCheck } from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import type { AdminNotification } from '@/features/notifications/hooks/useNotifications';
import { formatTime } from '@/lib/formatTime';

type NotificationModalProps = {
    close: () => void;
    onNavigate: (path: string, state: object) => void;
};

function getNotificationIcon(type: string, subType: string): string {
    // Sub-type takes priority (more specific)
    switch (subType) {
        case 'community-created':         return AppIcons.users;
        case 'community-joined':          return AppIcons.usergroup;
        case 'community-request-to-join': return AppIcons.usersRed;
        case 'community-updated':         return AppIcons.eclipseGreen;
        case 'community-suspended':       return AppIcons.unavailable;
        case 'post-reported':             return AppIcons.flagRed;
        case 'moment-created':            return AppIcons.lightning;
        case 'moment-reported':           return AppIcons.flagblue;
    }

    // Fall back to type
    switch (type) {
        case 'reply':      return AppIcons.messageBubble;
        case 'comment':    return AppIcons.messageMultiple;
        case 'post':       return AppIcons.clipboard;
        case 'moment':     return AppIcons.lightning;
        case 'events':     return AppIcons.calendar;
        case 'connection': return AppIcons.userBlocked;
        case 'community':  return AppIcons.users;
        default:           return AppIcons.bell;
    }
}


export const NotificationModal = ({ close, onNavigate }: NotificationModalProps) => {
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const { data, isLoading } = useNotifications();

    const allNotifications: AdminNotification[] = data?.payload?.adminNotifications ?? [];
    const unreadNotifications = allNotifications.filter(n => !n.is_read);
    const notifications = activeTab === 'all' ? allNotifications : unreadNotifications;

    return (
        <div className="flex h-full flex-col bg-white w-full">
            {/* Header */}
            <div className="shrink-0 border-b border-[#E8E8E8] pt-5">
                <div className="flex items-center justify-between mb-4 px-6">
                    <h2 className="text-[19px] font-semibold text-[#0A0D14]">
                        Notifications
                    </h2>
                    <button className="flex items-center gap-1 text-[13px] font-medium text-[#666] hover:text-[#333] cursor-pointer transition-colors">
                        Mark all as read
                        <CheckCheck className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center border-b border-transparent">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-2 text-[14px] font-medium transition-all relative px-12 w-[150px] cursor-pointer ${activeTab === 'all'
                            ? 'text-[#FF2860] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#FF2860]'
                            : 'text-[#666]'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab('unread')}
                        className={`pb-2 text-[14px] font-medium transition-all relative px-12 cursor-pointer ${activeTab === 'unread'
                            ? 'text-[#FF2860] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#FF2860]'
                            : 'text-[#666]'
                            }`}
                    >
                        Unread({unreadNotifications.length})
                    </button>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center h-40 text-[#666]">
                        <p className="text-sm">Loading...</p>
                    </div>
                )}

                {!isLoading && notifications.map((notification) => (
                    <div
                        key={notification.id}
                        onClick={() => {
                            close();
                            onNavigate(`/notifications/Details/${notification.id}`, { notification });
                        }}
                        className="px-6 py-4 border-b border-[#F2F4F7] hover:bg-[#FAF9F6] transition-colors cursor-pointer flex gap-3 group relative"
                    >
                        {/* Icon */}
                        <div className="shrink-0 w-10 h-10 rounded-full bg-[#F9FAFB] border border-[#EAECF0] flex items-center justify-center">
                            <img src={getNotificationIcon(notification.type, notification.sub_type)} alt="" className="w-5 h-5 opacity-60" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-[14px] font-medium text-[#101828] truncate pr-4">
                                    {notification.title}
                                </h3>
                                {!notification.is_read && (
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-[#FF2860] mt-1.5" />
                                )}
                            </div>
                            <p className="text-[13px] text-[#475467] leading-relaxed mt-0.5 line-clamp-2">
                                {notification.desc}
                            </p>
                            <span className="text-[12px] text-[#98A2B3] mt-1.5 block">
                                {formatTime(notification.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}

                {!isLoading && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-[#666]">
                        <p className="text-sm">No notifications found</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-6 py-5">
                <Button
                    onClick={close}
                    variant={BUTTON_TYPE.SECONDARY}
                    className="w-full justify-center"
                >
                    Close
                </Button>
            </div>
        </div>
    );
};
