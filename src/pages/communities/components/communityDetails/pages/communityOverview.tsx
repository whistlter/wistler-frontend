// src/features/moderation/components/OverviewTab.tsx

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

export function CommunityOverviewTab({ stats, activities }: OverviewTabProps) {
    const statsCards = [
        {
            eclipse: AppIcons.eclipseRed, icon: AppIcons.usersRed,
            label: "Members",
            value: stats?.flaggedPosts || 0,
            subLabel: "Total members in this community"
        },
        {
            eclipse: AppIcons.eclipseGreen, icon: AppIcons.usersgroupGreen,
            label: "Posts This Month",
            value: stats?.flaggedComments || 0,
            subLabel: "Total posts this month"

        },
        {
            eclipse: AppIcons.eclipseBlue, icon: AppIcons.messageMultipleBlue,
            label: "Pending Reviews",
            value: stats?.itemsInReview || 0,
            subLabel: "Number of posts under reviews"
        },

    ];

    const getActivityIcon = (action: string) => {
        if (action.toLowerCase().includes("comment")) return "💬";
        if (action.toLowerCase().includes("edit")) return "✏️";
        if (action.toLowerCase().includes("delete")) return "🗑️";
        if (action.toLowerCase().includes("flag")) return "🚩";
        return "•";
    };

    return (
        <div className="flex flex-col gap-4 pt-6">
            <section className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex gap-4 items-center">
                    <img
                        src="https://i.pravatar.cc/100?img=12"
                        alt="Community avatar"
                        className="h-20 w-20 rounded-full object-cover"
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-[19px] font-semibold text-[#0A0D14]">
                                Creative Minds Lounge
                            </h1>

                            <span className="flex items-center gap-2 rounded-[8px] border border-[#E8E8E8] px-3 py-1 text-[13px] font-medium text-[#667085]">
                                <span className="h-2 w-2 rounded-[2px] bg-[#12B76A]" />
                                Active
                            </span>
                        </div>

                        <p className="max-w-[720px] text-[14px] leading-[22px] text-[#667085]">
                            A space for designers, writers, and builders to share ideas,
                            exchange feedback, and collaborate on exciting projects.
                        </p>
                    </div>
                </div>

                {/* Meta information */}
                <div className="flex flex-col gap-3 text-[13px] text-[#667085]">
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.dashboard} alt="" />
                        <span>Category:</span>
                        <span className="font-medium text-[#344054]">
                            Art and Design
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.eyeOpen} alt="" />
                        <span>Visibility:</span>
                        <span className="font-medium text-[#344054]">
                            Public
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.calendar} alt="" />
                        <span>Created On:</span>
                        <span className="font-medium text-[#344054]">
                            March 14, 2024
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.user} alt="" />
                        <span>Admin:</span>
                        <div className="flex items-center gap-2 rounded-full border border-[#E8E8E8] px-2 py-1">
                            <img
                                src="https://i.pravatar.cc/100?img=32"
                                alt="Admin"
                                className="h-5 w-5 rounded-full"
                            />
                            <span className="font-medium text-[#344054]">
                                Audrey Merlin
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.users} alt="" />
                        <span>Moderators:</span>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 rounded-full border border-[#E8E8E8] px-2 py-1">
                                <img
                                    src="https://i.pravatar.cc/100?img=45"
                                    alt="Moderator"
                                    className="h-5 w-5 rounded-full"
                                />
                                <span className="font-medium text-[#344054]">
                                    Dana Cole
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-full border border-[#E8E8E8] px-2 py-1">
                                <img
                                    src="https://i.pravatar.cc/100?img=52"
                                    alt="Moderator"
                                    className="h-5 w-5 rounded-full"
                                />
                                <span className="font-medium text-[#344054]">
                                    Marcus Grey
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <h2 className="mb-4 text-[14px] font-normal text-[#0A0D14] border-b border-t border-[#E8E8E8] w-full py-4">
                <div className="pl-6">
                    Stats Overview
                </div>
            </h2>
            {/* STATS GRID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-6">
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
                        <div className="grid grid-cols-1">
                            <span className="text-[20px] font-normal text-[#0A0D14] leading-none p-4">
                                {card.value.toLocaleString()}
                            </span>
                            <span className="text-[13px] leading-[22px] text-[#969696] pl-4 pb-6">
                                {card.subLabel}
                            </span>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}



type Person = {
    name: string;
    avatar: string;
};

type CommunityOverviewSectionProps = {
    name: string;
    description: string;
    image: string;
    status?: "Active" | "Suspended";
    category: string;
    visibility: string;
    createdOn: string;
    admin: Person;
    moderators: Person[];
};

export const CommunityOverviewSection = ({
    name,
    description,
    image,
    status = "Active",
    category,
    visibility,
    createdOn,
    admin,
    moderators,
}: CommunityOverviewSectionProps) => {
    return (
        <section className="flex flex-col gap-6 border-b border-[#E8E8E8] pb-6">
            {/* Top row */}
            <div className="flex gap-4">
                <img
                    src={image}
                    alt={name}
                    className="h-12 w-12 rounded-full object-cover"
                />

                <div className="flex flex-col gap-2">
                    {/* Name + status */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-[19px] font-semibold text-[#0A0D14]">
                            {name}
                        </h1>

                        <span className="flex items-center gap-2 rounded-full border border-[#E8E8E8] px-3 py-1 text-[13px] font-medium text-[#667085]">
                            <span className="h-2 w-2 rounded-full bg-[#12B76A]" />
                            {status}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="max-w-[720px] text-[14px] leading-[22px] text-[#667085]">
                        {description}
                    </p>
                </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-col gap-3 text-[13px] text-[#667085]">
                <div className="flex items-center gap-2">
                    <span>Category:</span>
                    <span className="font-medium text-[#344054]">{category}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span>Visibility:</span>
                    <span className="font-medium text-[#344054]">{visibility}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span>Created On:</span>
                    <span className="font-medium text-[#344054]">{createdOn}</span>
                </div>

                {/* Admin */}
                <div className="flex items-center gap-2">
                    <span>Admin:</span>
                    <div className="flex items-center gap-2 rounded-full border border-[#E8E8E8] px-2 py-1">
                        <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="h-5 w-5 rounded-full"
                        />
                        <span className="text-[13px] font-medium text-[#344054]">
                            {admin.name}
                        </span>
                    </div>
                </div>

                {/* Moderators */}
                <div className="flex items-center gap-2">
                    <span>Moderators:</span>
                    <div className="flex gap-2">
                        {moderators.map((mod) => (
                            <div
                                key={mod.name}
                                className="flex items-center gap-2 rounded-full border border-[#E8E8E8] px-2 py-1"
                            >
                                <img
                                    src={mod.avatar}
                                    alt={mod.name}
                                    className="h-5 w-5 rounded-full"
                                />
                                <span className="text-[13px] font-medium text-[#344054]">
                                    {mod.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};