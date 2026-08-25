// src/pages/activity-logs/ActivityLogs.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { Activity } from "lucide-react";
import { Pagination } from "@/components/pagination/Pagination";
import { Skeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useActivities } from "@/features/activities/hooks/useActivities";
import type { ActivityItem } from "@/features/activities/hooks/useActivities";
import { formatTime } from "@/lib/formatTime";

type Tab = "all" | "community" | "user";

const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "community", label: "Communities" },
    { key: "user", label: "Users" },
];

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


export default function ActivityLogs() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("all");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 30;
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search activity logs...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const { data, isLoading } = useActivities({
        page,
        pageSize: PAGE_SIZE,
        search: searchTerm || undefined,
        sort: activeTab,
    });

    const activities: ActivityItem[] = data?.payload?.activities ?? [];
    const totalPages = data?.payload?.meta?.totalPages ?? 1;

    return (
        <div className="flex w-full flex-col">
            {/* HEADER */}
            <div className="p-6">
                <h1 className="text-[19px] font-semibold text-[#0A0D14]">
                    Activity Logs
                </h1>
                <p className="text-[13px] font-medium text-[#666] mt-1">
                    Track platform activity across users and communities. Switch between tabs to focus on user actions or community-related events
                </p>
            </div>

            {/* TABS */}
            <div className="flex self-stretch border-b border-[#E8E8E8] bg-white w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setPage(1);
                            }}
                            className={`relative w-40 p-4 text-[13px] font-normal transition-colors cursor-pointer ${isActive ? "text-[#E31C5F]" : "text-[#666] hover:text-[#0A0D14]"
                                }`}
                        >
                            {tab.label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E31C5F]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ACTIVITY LIST */}
            <div className="p-6">
                {isLoading ? (
                    <div className="flex flex-col">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 py-4 border-b border-[#F5F5F5] last:border-b-0 px-2 -mx-2"
                            >
                                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                    <Skeleton className="h-3.5 w-1/3" />
                                    <Skeleton className="h-3 w-2/3" />
                                    <Skeleton className="h-2.5 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="No activity logs found"
                        description="Try adjusting your search or check back later."
                    />
                ) : (
                    <div className="flex flex-col">
                        {activities.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                onClick={() => navigate(`/activity-logs/Details/${item.id}`, { state: { activity: item } })}
                                className="flex items-start gap-4 py-4 border-b border-[#F5F5F5] last:border-b-0 cursor-pointer hover:bg-[#FAFAFA] transition-colors rounded-lg px-2 -mx-2"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-sm flex-shrink-0">
                                    <img src={getActivityIcon(item.type, item.sub_type)} alt="" className="w-5 h-5" />
                                </div>

                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="text-[14px] font-semibold text-[#0A0D14]">
                                        {item.title}
                                    </p>
                                    <p className="text-[13px] font-normal text-[#666]">
                                        {item.desc}
                                    </p>
                                    <p className="text-[12px] font-normal text-[#969696]">
                                        {formatTime(item.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
