// src/features/moderation/components/OverviewTab.tsx

import { Activity } from "lucide-react";
import { AppIcons } from "@/constants/constant";
import { EmptyState } from "@/components/common/EmptyState";

type ModerationStats = {
    flaggedPosts: number;
    flaggedComments: number;
    itemsInReview: number;
    userReports: number;
};

type ActivityItem = {
    id: string | number;
    action: string;
    description: string;
    badge?: string;
    time: string;
};

type OverviewTabProps = {
    stats: ModerationStats;
    activities: ActivityItem[];
};

export function ActivitiesLog({ activities }: Omit<OverviewTabProps, 'stats'>) {
    const getActivityIcon = (action: string) => {
        if (action.toLowerCase().includes("comment")) return AppIcons.unavailable;
        if (action.toLowerCase().includes("edit")) return AppIcons.unavailable;
        if (action.toLowerCase().includes("delete")) return AppIcons.unavailable;
        if (action.toLowerCase().includes("flag")) return AppIcons.unavailable;
        return "•";
    };

    return (
        <div className="flex flex-col gap-6 pt-6">

            {/* RECENT ACTIVITY */}
            <div>

                {!activities || activities.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="No recent activity"
                        description="Activity will show up here as it happens."
                    />
                ) : (
                    <div className="flex flex-col gap-4 px-6">
                        {activities.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 pb-4 border-b border-[#F5F5F5] last:border-b-0"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-sm flex-shrink-0">
                                    <img src={getActivityIcon(item.action)} alt="" />
                                </div>

                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="text-[14px] font-medium text-[#0A0D14]">
                                        {item.action}
                                    </p>

                                    <p className="text-[13px] font-normal text-[#666]">
                                        {item.description}
                                        {item.badge && (
                                            <span className="ml-2 inline-flex items-center rounded-md bg-[#F5F5F5] px-2 py-0.5 text-[12px] font-normal text-[#0A0D14]">
                                                {item.badge}
                                            </span>
                                        )}
                                    </p>

                                    <p className="text-[12px] font-normal text-[#969696]">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}