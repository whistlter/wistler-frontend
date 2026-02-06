// src/features/moderation/components/OverviewTab.tsx

import { AppIcons } from "@/constants/constant";
import type { CommunitiesApi } from "../../../types/community.types";

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
    stats?: ModerationStats;
    activities: ActivityItem[];
    community?: CommunitiesApi; // Community data from API
};

export function CommunityOverviewTab({ community }: OverviewTabProps) {
    const isInactive = community?.is_suspended || community?.status === 'in-active' || community?.is_deleted;

    const statsCards = [
        {
            eclipse: AppIcons.eclipseRed, icon: AppIcons.usersRed,
            label: "Members",
            value: community?.members_count || 0,
            subLabel: "Total community members"
        },
        {
            eclipse: AppIcons.eclipseGreen, icon: AppIcons.usersgroupGreen,
            label: "Status",
            value: isInactive ? 'in-active' : 'Active',
            subLabel: "Current community status"

        },
        {
            eclipse: AppIcons.eclipseBlue, icon: AppIcons.messageMultipleBlue,
            label: "Visibility",
            value: community?.visibility || 'Public',
            subLabel: "Community visibility"
        },

    ];



    return (
        <div className="flex flex-col gap-4 pt-6">
            <section className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex gap-4 items-center">
                    <img
                        src={community?.image || `https://i.pravatar.cc/100?img=${community?.id || 12}`}
                        alt="Community image"
                        className="h-20 w-20 rounded-full object-cover"
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-[19px] font-semibold text-[#0A0D14]">
                                {community?.title || 'N/A'}
                            </h1>

                            <span className="flex items-center gap-2 rounded-[8px] border border-[#E8E8E8] px-3 py-1 text-[13px] font-medium text-[#667085]">
                                <span className={`h-2 w-2 rounded-[2px] ${!isInactive ? 'bg-[#12B76A]' : 'bg-[#667085]'}`} />
                                {isInactive ? 'in-active' : 'Active'}
                            </span>
                        </div>

                        <p className="max-w-[720px] text-[14px] leading-[22px] text-[#667085]">
                            {community?.desc || 'No description available'}
                        </p>
                    </div>
                </div>

                {/* Meta information */}
                <div className="flex flex-col gap-3 text-[13px] text-[#667085]">
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.dashboard} alt="" />
                        <span>Code:</span>
                        <span className="font-medium text-[#344054]">
                            {community?.code || 'N/A'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.eyeOpen} alt="" />
                        <span>Visibility:</span>
                        <span className="font-medium text-[#344054]">
                            {community?.visibility || 'N/A'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.calendar} alt="" />
                        <span>Created:</span>
                        <span className="font-medium text-[#344054]">
                            {community?.createdAt ? new Date(community.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.user} alt="" />
                        <span>Safe Space:</span>
                        <span className="font-medium text-[#344054]">
                            {community?.is_safe_space ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.users} alt="" />
                        <span>Member Screening:</span>
                        <span className="font-medium text-[#344054]">
                            {community?.is_member_screening ? 'Yes' : 'No'}
                        </span>
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