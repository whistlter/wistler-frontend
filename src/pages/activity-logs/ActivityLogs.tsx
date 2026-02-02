// src/pages/activity-logs/ActivityLogs.tsx
import { useState, useEffect } from "react";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { Pagination } from "@/components/pagination/Pagination";
import { Loader } from "@/components/common/Loader";

type Tab = "Communities" | "Users";

type ActivityItem = {
    id: string | number;
    type: string;
    title: string;
    description: string;
    time: string;
};

// Mock data removed. Replace with actual API hook.
const mockUserActivities: ActivityItem[] = [];
const mockCommunityActivities: ActivityItem[] = [];

export default function ActivityLogs() {
    const [activeTab, setActiveTab] = useState<Tab>("Users");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    const { setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search activity logs...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const tabs = [
        { key: "Communities" as const, label: "Communities" },
        { key: "Users" as const, label: "Users" },
    ];

    const activities = activeTab === "Users" ? mockUserActivities : mockCommunityActivities;
    const totalPages = Math.ceil(activities.length / PAGE_SIZE);
    const isLoading = false;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "user_joined":
            case "user_removed":
            case "user_suspended":
                return AppIcons.user;
            case "role_changed":
                return AppIcons.userGroup;
            case "user_banned":
                return AppIcons.unavailable;
            case "user_shadowbanned":
                return AppIcons.eyeClosed;
            case "password_reset":
                return AppIcons.lock;
            case "community_created":
                return AppIcons.userGroup;
            case "community_suspended":
                return AppIcons.unavailable;
            case "community_deleted":
                return AppIcons.delete;
            default:
                return AppIcons.user;
        }
    };

    if (isLoading) {
        return <Loader fullScreen={false} text="Loading activity logs..." />;
    }

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
                            className={`relative w-60 p-4 text-[13px] font-normal transition-colors cursor-pointer ${isActive ? "text-[#E31C5F]" : "text-[#666] hover:text-[#0A0D14]"
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
                {activities.length === 0 ? (
                    <div className="rounded-xl border border-[#E8E8E8] bg-white py-12 text-center text-[13px] text-[#969696]">
                        No activity logs found
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {activities.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-4 py-4 border-b border-[#F5F5F5] last:border-b-0"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-sm flex-shrink-0">
                                    <img src={getActivityIcon(item.type)} alt="" className="w-5 h-5" />
                                </div>

                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="text-[14px] font-semibold text-[#0A0D14]">
                                        {item.title}
                                    </p>

                                    <p className="text-[13px] font-normal text-[#666]">
                                        {item.description}
                                    </p>

                                    <p className="text-[12px] font-normal text-[#969696]">
                                        {item.time}
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
