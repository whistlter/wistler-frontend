import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { AppIcons } from '@/constants/constant';
import { formatTime } from '@/lib/formatTime';
import { EmptyState } from '@/components/common/EmptyState';
import type { AdminNotification } from '@/features/notifications/hooks/useNotifications';

function getNotificationIcon(type: string, subType: string): string {
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
    switch (type) {
        case 'reply':      return AppIcons.messageBubble;
        case 'comment':    return AppIcons.messageMultiple;
        case 'post':       return AppIcons.clipboard;
        case 'moment':     return AppIcons.lightning;
        case 'events':     return AppIcons.calendar;
        case 'connection': return AppIcons.userBlocked;
        case 'community':  return AppIcons.users;
        case 'user':       return AppIcons.user;
        default:           return AppIcons.bell;
    }
}

type ColorScheme = {
    gradient: string;
    chipBg: string;
    chipText: string;
    chipBorder: string;
    accent: string;
    badgeDot: string;
};

function getColorScheme(type: string, subType: string): ColorScheme {
    if (subType?.includes('community') || type === 'community') {
        return {
            gradient: 'from-[#FF2860] to-[#ff6b9d]',
            chipBg: 'bg-[#fff0f4]',
            chipText: 'text-[#FF2860]',
            chipBorder: 'border-[#ffd6e3]',
            accent: 'text-[#FF2860]',
            badgeDot: 'bg-[#FF2860]',
        };
    }
    if (subType?.includes('moment') || type === 'moment') {
        return {
            gradient: 'from-[#7c3aed] to-[#a855f7]',
            chipBg: 'bg-purple-50',
            chipText: 'text-purple-700',
            chipBorder: 'border-purple-200',
            accent: 'text-purple-600',
            badgeDot: 'bg-purple-500',
        };
    }
    if (subType?.includes('post') || type === 'post' || type === 'comment' || type === 'reply') {
        return {
            gradient: 'from-[#f97316] to-[#fb923c]',
            chipBg: 'bg-orange-50',
            chipText: 'text-orange-700',
            chipBorder: 'border-orange-200',
            accent: 'text-orange-600',
            badgeDot: 'bg-orange-500',
        };
    }
    return {
        gradient: 'from-[#FF2860] to-[#E31C5F]',
        chipBg: 'bg-[#fff0f4]',
        chipText: 'text-[#FF2860]',
        chipBorder: 'border-[#ffd6e3]',
        accent: 'text-[#FF2860]',
        badgeDot: 'bg-[#FF2860]',
    };
}

function InfoChip({ label, value, colors }: { label: string; value: string; colors: ColorScheme }) {
    return (
        <div className={`flex flex-col gap-1 rounded-xl border px-5 py-4 ${colors.chipBorder} ${colors.chipBg}`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${colors.accent}`}>{label}</span>
            <span className="text-[14px] font-semibold text-[#0A0D14]">{value}</span>
        </div>
    );
}

export default function NotificationDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const notification = location.state?.notification as AdminNotification | undefined;

    if (!notification) {
        return (
            <div className="flex w-full flex-col p-6">
                <EmptyState
                    icon={FileQuestion}
                    title="No notification data found"
                    description="Please navigate here from the notifications panel."
                    action={{ label: '← Back to Dashboard', onClick: () => navigate('/') }}
                />
            </div>
        );
    }

    const icon = getNotificationIcon(notification.type, notification.sub_type);
    const colors = getColorScheme(notification.type, notification.sub_type);

    const formatFullDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const chips: { label: string; value: string }[] = [
        { label: 'Notification ID', value: `#${notification.id}` },
        { label: 'User ID', value: `#${notification.user_id}` },
        { label: 'Type', value: notification.type.charAt(0).toUpperCase() + notification.type.slice(1) },
        ...(notification.sub_type ? [{ label: 'Sub Type', value: notification.sub_type }] : []),
    ];

    return (
        <div className="flex w-full flex-col">
            {/* HEADER */}
            <div className="p-6">
                <div className="flex text-[#666] text-[13px] font-medium items-center">
                    <NavLink to="/" className="hover:text-[#0A0D14] transition-colors">
                        Dashboard
                    </NavLink>
                    <img src={AppIcons.chevronrightGrey} alt="" />
                    <span className="text-[#FF2860] truncate max-w-[280px]">{notification.title}</span>
                </div>
                <h1 className="text-[19px] font-semibold text-[#0A0D14] mt-1">Notification Details</h1>
            </div>

            <div className="border-t border-[#E8E8E8] w-full" />

            <div className="p-6 flex flex-col gap-6">

                {/* HERO BANNER */}
                <div className={`rounded-2xl bg-gradient-to-br ${colors.gradient} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/10" />

                    <div className="relative flex items-start gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <img src={icon} alt="" className="w-8 h-8 brightness-0 invert" />
                        </div>

                        <div className="flex flex-col gap-2 min-w-0">
                            <h2 className="text-[20px] font-bold text-white">{notification.title}</h2>
                            <p className="text-[14px] text-white/80 leading-relaxed">{notification.desc}</p>
                            <p className="text-[12px] text-white/60 mt-1">{formatTime(notification.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* INFO CHIPS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {chips.map((chip) => (
                        <InfoChip key={chip.label} label={chip.label} value={chip.value} colors={colors} />
                    ))}
                </div>

                {/* TIMELINE CARD */}
                <div className="rounded-xl border border-[#E8E8E8] bg-white overflow-hidden">
                    <div className="border-b border-[#EFEFF3] px-6 py-4 flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${colors.badgeDot}`} />
                        <p className="text-[14px] font-semibold text-[#0A0D14]">Timeline</p>
                    </div>
                    <div className="px-6 py-2 divide-y divide-[#F5F5F5]">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                    <img src={AppIcons.calendar} alt="" className="w-4 h-4" />
                                </div>
                                <span className="text-[13px] text-[#666]">Created</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[13px] font-medium text-[#0A0D14]">{formatFullDate(notification.createdAt)}</p>
                                <p className="text-[12px] text-[#969696]">{formatTime(notification.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                    <img src={AppIcons.calendar2} alt="" className="w-4 h-4" />
                                </div>
                                <span className="text-[13px] text-[#666]">Last Updated</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[13px] font-medium text-[#0A0D14]">{formatFullDate(notification.updatedAt)}</p>
                                <p className="text-[12px] text-[#969696]">{formatTime(notification.updatedAt)}</p>
                            </div>
                        </div>
                        {notification.object_id !== null && (
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                        <img src={AppIcons.propertySearch} alt="" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[13px] text-[#666]">Object ID</span>
                                </div>
                                <p className="text-[13px] font-medium text-[#0A0D14]">#{notification.object_id}</p>
                            </div>
                        )}
                        {notification.community_id !== null && (
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                        <img src={AppIcons.users} alt="" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[13px] text-[#666]">Community ID</span>
                                </div>
                                <p className="text-[13px] font-medium text-[#0A0D14]">#{notification.community_id}</p>
                            </div>
                        )}
                        {notification.relationShipId !== null && (
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                        <img src={AppIcons.usergroup} alt="" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[13px] text-[#666]">Relationship ID</span>
                                </div>
                                <p className="text-[13px] font-medium text-[#0A0D14]">#{notification.relationShipId}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
