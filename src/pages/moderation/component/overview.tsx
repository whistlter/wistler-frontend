// src/features/moderation/components/OverviewTab.tsx

import { ActivitiesLog } from "@/components/activityLog/ActivitiesLog";
import { AppIcons } from "@/constant/constant";

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

export function OverviewTab({ stats, activities }: OverviewTabProps) {
    const statsCards = [
        {
            eclipse: AppIcons.eclipseGrey, icon: AppIcons.flag,
            label: "Flagged posts",
            value: stats?.flaggedPosts || 0,
        },
        {
            eclipse: AppIcons.eclipseGrey, icon: AppIcons.flag,
            label: "Flagged comments",
            value: stats?.flaggedComments || 0,

        },
        {
            eclipse: AppIcons.eclipseGrey, icon: AppIcons.propertySearch,
            label: "Items in review",
            value: stats?.itemsInReview || 0,
        },
        {
            eclipse: AppIcons.eclipseGrey, icon: AppIcons.warning,
            label: "User reports",
            value: stats?.itemsInReview || 0,
        },
    ];


    return (
        <div className="flex flex-col gap-6 pt-6">
            {/* STATS GRID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-6">
                {statsCards.map((card) => (
                    <div
                        key={card.label}
                        className="flex flex-col gap-3 rounded-xl border border-[#E8E8E8] bg-white "
                    >
                        <div className="flex items-center gap-2 border-b border-[#E8E8E8] w-full p-4">
                            <div className="relative flex items-center justify-center">
                                <img src={card.eclipse} alt="" className="relative w-full " />
                                <img src={card.icon} alt="" className="absolute w-5" />
                            </div>
                            <span className="text-[13px] font-normal text-[#666]">
                                {card.label}
                            </span>
                        </div>

                        <span className="text-[20px] font-semibold text-[#0A0D14] leading-none p-4">
                            {card.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>



            {/* RECENT ACTIVITY */}
            <div>
                <h2 className="mb-4 text-[14px] font-normal text-[#0A0D14] border-b border-t border-[#E8E8E8] w-full py-4 pl-6">
                    <div className="px-2">
                        Recent Activity List
                    </div>
                </h2>

                <ActivitiesLog stats={stats} activities={activities} />
            </div>
        </div>
    );
}