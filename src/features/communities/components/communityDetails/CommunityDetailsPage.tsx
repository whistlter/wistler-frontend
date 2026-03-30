// src/features/moderation/ModerationPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommunityMembers } from "./pages/communityMembers";
import { CommunityPosts } from "./pages/communityPosts";
import { CommunityOverviewTab } from "./pages/communityOverview";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import { Button } from "@/components/button/Button";
import { AppIcons } from "@/constants/constant";
import type { FilterOption } from "@/components/filter/types";
import { useModal } from "@/components/modal";
import { BUTTON_TYPE } from "@/components/button/constants";
import { ActionType } from "@/constants/actions";
import { ActionModal, DateRangeModal, StatusFilterModal } from "@/components/modal";
import { NavLink } from "react-router-dom";
import { useCommunity, useSuspendCommunity, useActivateCommunity, useSoftDeleteCommunity } from "@/features/communities/hooks/useCommunity";
import { AxiosError } from "axios";
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";


type Tab = "overview" | "Members" | "Posts";

export default function CommunityDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openModal, } = useModal();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const { data: communityData, isLoading, isError, error } = useCommunity(id || '');
    const { mutateAsync: suspendCommunity } = useSuspendCommunity();
    const { mutateAsync: activateCommunity } = useActivateCommunity();
    const { mutateAsync: softDeleteCommunity } = useSoftDeleteCommunity();

    // Debug log
    console.log('Route ID:', id);
    console.log('Community data:', communityData);
    console.log('Community error:', error);
    console.log('Is loading:', isLoading);
    console.log('Is error:', isError);

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
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
                <h3 className="font-semibold mb-2">Failed to load community data</h3>
                <p className="text-sm mb-2">{(error as AxiosError)?.message || "Unknown error"}</p>
                <p className="text-xs text-red-500">
                    Status: {(error as AxiosError)?.response?.status} - {(error as AxiosError)?.response?.statusText}
                </p>
                <p className="text-xs mt-2 text-gray-600">
                    Check the browser console for more details. Make sure community ID {id} exists on the backend.
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
            time: community.createdAt || '',
        },
        {
            id: 2,
            action: 'Last Updated',
            description: `Community updated on ${community.updatedAt ? new Date(community.updatedAt).toLocaleDateString() : 'N/A'}`,
            time: community.updatedAt || '',
        },
    ];

    const suspendCommunityFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.suspendedUserRed
                }}
                title="Suspend this community"
                description="Are you sure you want to suspend this community? Members will no longer be able to post, comment, or join until it is reactivated."
                primaryLabel={ActionType.SUSPEND_COMMUNITY}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    if (!id) return;
                    try {
                        await suspendCommunity(id);
                        showSuccessToast("Community Suspended", "The community has been suspended successfully.");
                        close();
                    } catch (error) {
                        showErrorToast("Suspension Failed", getErrorMessage(error));
                    }
                }}
            />
        ));
    }

    const activateCommunityFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseGreen,
                    icon: AppIcons.usersgroupGreen
                }}
                title="Activate this community"
                description="This will restore the community. Members will be able to post, comment, and join again."
                primaryLabel={ActionType.ACTIVATE_COMMUNITY}
                primaryIntent="default"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    if (!id) return;
                    try {
                        await activateCommunity(id);
                        showSuccessToast("Community Activated", "The community has been reactivated successfully.");
                        close();
                    } catch (error) {
                        showErrorToast("Activation Failed", getErrorMessage(error));
                    }
                }}
            />
        ));
    }

    const deleteCommunityFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Delete community"
                description={`Are you sure you want to delete ${community?.title || 'this community'}? This action will remove the community, all posts, comments, and member data associated with it. Once deleted, this community cannot be recovered.`}
                primaryLabel="Delete community"
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {
                    if (!id) return;
                    try {
                        await softDeleteCommunity(id);
                        showSuccessToast("Community Deleted", "The community has been deleted successfully.");
                        close();
                        navigate('/communities');
                    } catch (error) {
                        showErrorToast("Deletion Failed", getErrorMessage(error));
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
        <div className="flex w-full flex-col ">
            {/* HEADER */}
            <div className="p-6 lg:py-0 lg:pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
                    <div className="flex lg:w-fit sm:w-70  flex-col items-start gap-1 shrink-0">
                        <div className="flex text-[#666]  text-[13px] font-medium ">
                            <NavLink to={'/communities'}>Communities</NavLink> <img src={AppIcons.chevronrightGrey} alt="" /> <span className="text-[#FF2860]">{community.title}</span>
                        </div>
                        <div className="text-[#0A0D14] text-center text-[19px] font-semibold">
                            Community Details
                        </div>
                    </div>
                    <div className={` flex ${activeTab === "overview" ? 'lg:py-6' : 'justify-end w-full gap-6 lg:py-6'}  `}>
                        <div className="flex gap-3 lg:ml-auto w-full lg:w-[70%]">
                            {(community.is_suspended || community.status === 'in-active' || community.is_deleted) ? (
                                <Button leftIcon={AppIcons.usersgroupGreen} variant={BUTTON_TYPE.TETIARY} onClick={() => activateCommunityFn()} className="!text-[#0A0D14] hover:!bg-gray-50">
                                    {ActionType.ACTIVATE_COMMUNITY}
                                </Button>
                            ) : (
                                <Button leftIcon={AppIcons.unavailable} variant={BUTTON_TYPE.TETIARY} onClick={() => suspendCommunityFn()}>
                                    {ActionType.SUSPEND_COMMUNITY}
                                </Button>
                            )}
                            <Button leftIcon={AppIcons.delete_red} variant={BUTTON_TYPE.TETIARY} onClick={() => deleteCommunityFn()}>
                                {ActionType.DELETE_COMMUNITY}
                            </Button>
                        </div>
                        {(activeTab === "Members" || activeTab === "Posts") && (
                            <div className="grid w-fit">
                                <FilterDropdown options={filterOptions} onSelect={handleFilterSelect} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex  self-stretch  border-b border-t  border-[#E8E8E8] bg-white w-full">
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