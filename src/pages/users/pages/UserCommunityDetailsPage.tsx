// src/pages/users/pages/UserCommunityDetailsPage.tsx
import { useState } from "react";
import { AxiosError } from "axios";
import { useParams, NavLink } from "react-router-dom";
import { CommunityMembers } from "@/features/communities/components/communityDetails/pages/communityMembers";
import { CommunityPosts } from "@/features/communities/components/communityDetails/pages/communityPosts";
import { CommunityOverviewTab } from "@/features/communities/components/communityDetails/pages/communityOverview";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import { Button } from "@/components/button/Button";
import { AppIcons } from "@/constants/constant";
import type { FilterOption } from "@/components/filter/types";
import { useModal } from "@/components/modal";
import { BUTTON_TYPE } from "@/components/button/constants";
import { ActionType } from "@/constants/actions";
import { ActionModal, DateRangeModal, StatusFilterModal } from "@/components/modal";
import { useCommunity, useSuspendCommunity } from "@/features/communities/hooks/useCommunity";
import { showSuccessToast, showErrorToast } from "@/components/common/toastUtils";

type Tab = "overview" | "Members" | "Posts";

export default function UserCommunityDetailsPage() {
    const { userId, communityId } = useParams<{ userId: string; communityId: string }>();
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const { mutateAsync: suspendCommunity } = useSuspendCommunity();
    // Use the general community endpoint since the user-specific endpoint doesn't exist
    const { data: communityData, isLoading, isError, error } = useCommunity(communityId || '');

    const community = communityData?.payload?.community;

    const tabs = [
        { key: "overview" as const, label: "Overview" },
        { key: "Members" as const, label: "Members" },
        { key: "Posts" as const, label: "Posts" },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        const axiosError = error as AxiosError;
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
                <h3 className="font-semibold mb-2">Failed to load community data</h3>
                <p className="text-sm mb-2">{axiosError.message || "Unknown error"}</p>
                <p className="text-xs text-red-500">
                    Status: {axiosError.response?.status} - {axiosError.response?.statusText}
                </p>
                <p className="text-xs mt-2 text-gray-600">
                    Check the browser console for more details. Make sure community ID {communityId} exists on the backend.
                </p>
            </div>
        );
    }

    /* ----------------------------
       LOADING STATE
    ---------------------------- */
    if (isLoading) {
        return (
            <div className="py-20 text-center text-[13px] text-[#969696]">
                Loading community data…
            </div>
        );
    }

    /* ----------------------------
       NO DATA STATE
    ---------------------------- */
    if (!community) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600">
                No community data available
            </div>
        );
    }

    // Format stats data from community
    const stats = {
        flaggedPosts: 0,
        flaggedComments: 0,
        itemsInReview: 0,
        userReports: 0,
    };

    const activities = [
        {
            id: 1,
            action: 'Community Created',
            description: `Community created on ${community.createdAt ? new Date(community.createdAt).toLocaleDateString() : 'N/A'}`,
            time: community.createdAt || 'N/A',
        },
        {
            id: 2,
            action: 'Last Updated',
            description: `Community updated on ${community.updatedAt ? new Date(community.updatedAt).toLocaleDateString() : 'N/A'}`,
            time: community.updatedAt || 'N/A',
        },
    ];



    const suspendCommunityFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Suspend community"
                description="Temporarily disables this community."
                primaryLabel={ActionType.SUSPEND_COMMUNITY}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    if (communityId) {
                        try {
                            await suspendCommunity(communityId);
                            showSuccessToast("Community Suspended", "The community has been successfully suspended.");
                            close();
                        } catch (error) {
                            console.error(error);
                            showErrorToast("Suspension Failed", "Failed to suspend community.");
                        }
                    }
                }}
            />
        ));
    }

    const handleFilterSelect = (option: FilterOption) => {
        if (option.value === 'date') {
            openModal(({ close }) => (
                <DateRangeModal
                    close={close}
                    onApply={(startDate, endDate) => {
                        console.log('Date range selected:', startDate, endDate);
                        // Handle the date range filter here
                    }}
                />
            ), { type: 'center' });
        } else if (option.value === 'status') {
            openModal(({ close }) => (
                <StatusFilterModal
                    close={close}
                    onApply={(selectedStatuses) => {
                        console.log('Status filter selected:', selectedStatuses);
                        // Handle the status filter here
                    }}
                />
            ), { type: 'center' });
        } else {
            console.log('Filter selected:', option.value);
        }
    };

    /* ----------------------------
       RENDER
    ---------------------------- */
    const filterOptions: FilterOption[] = [
        {
            label: "Date",
            value: "date",
            icon: AppIcons.calendar,
        },
        {
            label: "Status",
            value: "status",
            icon: AppIcons.lightning,
        }
    ];

    return (
        <div className="flex w-full flex-col">
            {/* HEADER */}
            <div className="p-6 lg:py-0 lg:pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex lg:w-fit sm:w-70 flex-col items-start gap-1 shrink-0">
                        <div className="flex text-[#666] text-[13px] font-medium">
                            <NavLink to={'/users'}>Users</NavLink>
                            <img src={AppIcons.chevronrightGrey} alt="" />
                            <NavLink to={`/users/Details/${userId}`}>User Details</NavLink>
                            <img src={AppIcons.chevronrightGrey} alt="" />
                            <span className="text-[#FF2860]">{community.title}</span>
                        </div>
                        <div className="text-[#0A0D14] text-center text-[19px] font-semibold">
                            Community Details
                        </div>
                    </div>
                    <div className={`grid ${activeTab === "overview" ? 'grid-cols-1 lg:py-6' : 'grid-cols-[1fr_100px] justify-end w-full justify-items-center gap-6 lg:py-6'}`}>
                        <div className="lg:grid lg:w-70 lg:ml-auto w-full">
                            <Button leftIcon={AppIcons.unavailable} variant={BUTTON_TYPE.TETIARY} onClick={() => suspendCommunityFn()}>
                                {ActionType.SUSPEND_COMMUNITY}
                            </Button>
                        </div>
                        <div className="grid w-full">
                            {(activeTab === "Members" || activeTab === "Posts") &&
                                <FilterDropdown options={filterOptions} onSelect={handleFilterSelect} />
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex self-stretch border-b border-t border-[#E8E8E8] bg-white w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
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

            {/* TAB CONTENT */}
            {activeTab === "overview" && (
                <CommunityOverviewTab stats={stats} activities={activities || []} community={community} />
            )}
            {activeTab === "Members" && <CommunityMembers />}
            {activeTab === "Posts" && <CommunityPosts />}
        </div>
    );
}
