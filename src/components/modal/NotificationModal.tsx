import { useState } from 'react';
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { AppIcons } from "@/constants/constant";
import { CheckCheck } from 'lucide-react';

type NotificationModalProps = {
    close: () => void;
};

// Mock data matching the user's image
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'community_created',
        title: 'New community created',
        description: 'Creative Minds Lounge has been created and is ready for moderation',
        time: '2 minutes ago',
        isUnread: true,
        icon: AppIcons.users, // Placeholder, usually a group icon
    },
    {
        id: 2,
        type: 'community_suspended',
        title: 'Community suspended',
        description: 'Side Hustlers Hub has been suspended. Members can no longer post or comment',
        time: '1 hour ago',
        isUnread: false,
        icon: AppIcons.unavailable, // Placeholder for block
    },
    {
        id: 3,
        type: 'community_updated',
        title: 'Community updated',
        description: 'Settings for Book Haven were updated successfully',
        time: 'Yesterday',
        isUnread: false,
        icon: AppIcons.eclipseGreen, // Placeholder for check/success
    },
    {
        id: 4,
        type: 'post_reported',
        title: 'Post reported',
        description: 'A post in Tech Rookies was moved to the review queue.',
        time: '2 days ago',
        isUnread: false,
        icon: AppIcons.flag,
    },
    {
        id: 5,
        type: 'content_review',
        title: 'Content moved to review',
        description: 'A post in Tech Rookies was moved to the review queue',
        time: '2 days ago',
        isUnread: false,
        icon: AppIcons.search,
    },
    {
        id: 2,
        type: 'community_suspended',
        title: 'Community suspended',
        description: 'Side Hustlers Hub has been suspended. Members can no longer post or comment',
        time: '1 hour ago',
        isUnread: false,
        icon: AppIcons.unavailable, // Placeholder for block
    },
    {
        id: 3,
        type: 'community_updated',
        title: 'Community updated',
        description: 'Settings for Book Haven were updated successfully',
        time: 'Yesterday',
        isUnread: false,
        icon: AppIcons.eclipseGreen, // Placeholder for check/success
    },
    {
        id: 4,
        type: 'post_reported',
        title: 'Post reported',
        description: 'A post in Tech Rookies was moved to the review queue.',
        time: '2 days ago',
        isUnread: false,
        icon: AppIcons.flag,
    },
    {
        id: 5,
        type: 'content_review',
        title: 'Content moved to review',
        description: 'A post in Tech Rookies was moved to the review queue',
        time: '2 days ago',
        isUnread: false,
        icon: AppIcons.search,
    },
];

export const NotificationModal = ({ close }: NotificationModalProps) => {
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

    const notifications = activeTab === 'all'
        ? MOCK_NOTIFICATIONS
        : MOCK_NOTIFICATIONS.filter(n => n.isUnread);

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
                        Unread({MOCK_NOTIFICATIONS.filter(n => n.isUnread).length})
                    </button>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="px-6 py-4 border-b border-[#F2F4F7] hover:bg-[#FAF9F6] transition-colors cursor-pointer flex gap-3 group relative"
                    >
                        {/* Icon */}
                        <div className="shrink-0 w-10 h-10 rounded-full bg-[#F9FAFB] border border-[#EAECF0] flex items-center justify-center">
                            <img src={notification.icon} alt="" className="w-5 h-5 opacity-60" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-[14px] font-medium text-[#101828] truncate pr-4">
                                    {notification.title}
                                </h3>
                                {notification.isUnread && (
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-[#FF2860] mt-1.5" />
                                )}
                            </div>
                            <p className="text-[13px] text-[#475467] leading-relaxed mt-0.5 line-clamp-2">
                                {notification.description}
                            </p>
                            <span className="text-[12px] text-[#98A2B3] mt-1.5 block">
                                {notification.time}
                            </span>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
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
