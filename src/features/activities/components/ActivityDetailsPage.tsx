import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { AppIcons } from '@/constants/constant';
import { formatTime } from '@/lib/formatTime';
import { EmptyState } from '@/components/common/EmptyState';
import type { ActivityItem } from '@/features/activities/hooks/useActivities';

function getActivityIcon(type: string, subType: string): string {
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
        default:           return AppIcons.activityRed;
    }
}

type ColorScheme = {
    gradient: string;
    iconBg: string;
    badge: string;
    badgeDot: string;
    badgeText: string;
    accent: string;
    chipBg: string;
    chipText: string;
    chipBorder: string;
};

function getColorScheme(type: string, subType: string): ColorScheme {
    if (subType?.includes('community') || type === 'community') {
        return {
            gradient: 'from-[#FF2860] to-[#ff6b9d]',
            iconBg: 'bg-[#fff0f4]',
            badge: 'bg-[#fff0f4] border-[#ffd6e3]',
            badgeDot: 'bg-[#FF2860]',
            badgeText: 'text-[#FF2860]',
            accent: 'text-[#FF2860]',
            chipBg: 'bg-[#fff0f4]',
            chipText: 'text-[#FF2860]',
            chipBorder: 'border-[#ffd6e3]',
        };
    }
    if (subType?.includes('moment') || type === 'moment') {
        return {
            gradient: 'from-[#7c3aed] to-[#a855f7]',
            iconBg: 'bg-purple-50',
            badge: 'bg-purple-50 border-purple-200',
            badgeDot: 'bg-purple-500',
            badgeText: 'text-purple-700',
            accent: 'text-purple-600',
            chipBg: 'bg-purple-50',
            chipText: 'text-purple-700',
            chipBorder: 'border-purple-200',
        };
    }
    if (subType?.includes('post') || type === 'post' || type === 'comment' || type === 'reply') {
        return {
            gradient: 'from-[#f97316] to-[#fb923c]',
            iconBg: 'bg-orange-50',
            badge: 'bg-orange-50 border-orange-200',
            badgeDot: 'bg-orange-500',
            badgeText: 'text-orange-700',
            accent: 'text-orange-600',
            chipBg: 'bg-orange-50',
            chipText: 'text-orange-700',
            chipBorder: 'border-orange-200',
        };
    }
    // default / user
    return {
        gradient: 'from-[#FF2860] to-[#E31C5F]',
        iconBg: 'bg-[#fff0f4]',
        badge: 'bg-[#fff0f4] border-[#ffd6e3]',
        badgeDot: 'bg-[#FF2860]',
        badgeText: 'text-[#FF2860]',
        accent: 'text-[#FF2860]',
        chipBg: 'bg-[#fff0f4]',
        chipText: 'text-[#FF2860]',
        chipBorder: 'border-[#ffd6e3]',
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

export default function ActivityDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const activity = location.state?.activity as ActivityItem | undefined;

    if (!activity) {
        return (
            <div className="flex w-full flex-col p-6">
                <EmptyState
                    icon={FileQuestion}
                    title="No activity data found"
                    description="Please navigate here from the activity logs or dashboard."
                    action={{ label: '← Back to Activity Logs', onClick: () => navigate('/activity-logs') }}
                />
            </div>
        );
    }

    const icon = getActivityIcon(activity.type, activity.sub_type);
    const colors = getColorScheme(activity.type, activity.sub_type);

    const formatFullDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <div className="flex w-full flex-col">
            {/* HEADER */}
            <div className="p-6">
                <div className="flex text-[#666] text-[13px] font-medium items-center">
                    <NavLink to="/activity-logs" className="hover:text-[#0A0D14] transition-colors">
                        Activity Logs
                    </NavLink>
                    <img src={AppIcons.chevronrightGrey} alt="" />
                    <span className="text-[#FF2860] truncate max-w-[280px]">{activity.title}</span>
                </div>
                <h1 className="text-[19px] font-semibold text-[#0A0D14] mt-1">Activity Details</h1>
            </div>

            <div className="border-t border-[#E8E8E8] w-full" />

            <div className="p-6 flex flex-col gap-6">

                {/* HERO BANNER */}
                <div className={`rounded-2xl bg-gradient-to-br ${colors.gradient} p-6 text-white relative overflow-hidden`}>
                    {/* decorative circles */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/10" />

                    <div className="relative flex items-start gap-5">
                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm`}>
                            <img src={icon} alt="" className="w-8 h-8 brightness-0 invert" />
                        </div>

                        <div className="flex flex-col gap-2 min-w-0">
                            <h2 className="text-[20px] font-bold text-white">{activity.title}</h2>
                            <p className="text-[14px] text-white/80 leading-relaxed">{activity.desc}</p>
                            <p className="text-[12px] text-white/60 mt-1">{formatTime(activity.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* INFO CHIPS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoChip label="Activity ID" value={`#${activity.id}`} colors={colors} />
                    <InfoChip label="User ID" value={`#${activity.user_id}`} colors={colors} />
                    <InfoChip label="Type" value={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} colors={colors} />
                    {activity.sub_type
                        ? <InfoChip label="Sub Type" value={activity.sub_type} colors={colors} />
                        : activity.object_id !== null
                            ? <InfoChip label="Object ID" value={`#${activity.object_id}`} colors={colors} />
                            : null
                    }
                </div>

                {/* TIMELINE CARD */}
                <div className="rounded-xl border border-[#E8E8E8] bg-white overflow-hidden">
                    <div className={`border-b border-[#EFEFF3] px-6 py-4 flex items-center gap-3`}>
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
                                <p className="text-[13px] font-medium text-[#0A0D14]">{formatFullDate(activity.createdAt)}</p>
                                <p className="text-[12px] text-[#969696]">{formatTime(activity.createdAt)}</p>
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
                                <p className="text-[13px] font-medium text-[#0A0D14]">{formatFullDate(activity.updatedAt)}</p>
                                <p className="text-[12px] text-[#969696]">{formatTime(activity.updatedAt)}</p>
                            </div>
                        </div>
                        {activity.object_id !== null && activity.sub_type && (
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                        <img src={AppIcons.propertySearch} alt="" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[13px] text-[#666]">Object ID</span>
                                </div>
                                <p className="text-[13px] font-medium text-[#0A0D14]">#{activity.object_id}</p>
                            </div>
                        )}
                        {activity.community_id !== null && (
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.chipBg}`}>
                                        <img src={AppIcons.users} alt="" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[13px] text-[#666]">Community ID</span>
                                </div>
                                <p className="text-[13px] font-medium text-[#0A0D14]">#{activity.community_id}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
