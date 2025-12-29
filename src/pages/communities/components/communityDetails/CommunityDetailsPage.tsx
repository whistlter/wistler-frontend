// src/features/moderation/ModerationPage.tsx
import { useModeration } from "@/pages/moderation/hook/useModerator";
import { useState } from "react";
import { CommunityMembers } from "./pages/communityMembers";
import { CommunityPosts } from "./pages/communityPosts";
import { CommunityOverviewTab } from "./pages/communityOverview";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import { Button } from "@/components/button/Button";
import { AppIcons } from "@/constant/constant";
import type { FilterOption } from "@/components/filter/types";
import { useModal } from "@/components/modal";
import { BUTTON_TYPE } from "@/components/button/constants";
import { ActionType } from "@/constant/actions";
import { ActionModal } from "@/components/modal/actionModal";
import { NavLink } from "react-router-dom";



type Tab = "overview" | "Members" | "Posts";

export default function CommunityDetailsPage() {
    const { openModal, } = useModal();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const { stats, activities, isLoading, isError, error } = useModeration();

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
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                {(error as any)?.message ?? "Failed to load moderation data"}
            </div>
        );
    }

    /* ----------------------------
       LOADING STATE
    ---------------------------- */
    if (isLoading) {
        return (
            <div className="py-20 text-center text-[13px] text-[#969696]">
                Loading moderation data…
            </div>
        );
    }

    /* ----------------------------
       NO DATA STATE
    ---------------------------- */
    if (!stats) {
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600">
                No moderation data available
            </div>
        );
    }
    const suspendUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Suspend user"
                description="Temporarily disables account access."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.SUSPEND_USER}
                primaryIntent="danger"
                showLoader
                buttonType={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
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
                            <NavLink to={'/community'}>Communities</NavLink> <img src={AppIcons.chevronrightGrey} alt="" /> <span className="text-[#FF2860]">{'Creative Minds Lounge'}</span>
                        </div>
                        <div className="text-[#0A0D14] text-center text-[19px] font-semibold">
                            Communities Details
                        </div>
                    </div>
                    <div className={` grid ${activeTab === "overview" ? 'grid-cols-1 lg:py-6' : 'grid-cols-[1fr_100px] justify-end w-full justify-items-center gap-6 lg:py-6'}  `}>
                        <div className="lg:grid lg:w-70 lg:ml-auto w-full">
                            <Button leftIcon={AppIcons.unavailable} type={BUTTON_TYPE.TETIARY} onClick={() => suspendUserFn()}>
                                {ActionType.SUSPEND_COMMUNITY}
                            </Button>

                        </div>
                        <div className="grid w-full">
                            {(activeTab === "Members" || activeTab === "Posts") &&
                                <FilterDropdown options={filterOptions} onSelect={(value) => console.log(value.value)} />
                            }

                        </div>
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
                <CommunityOverviewTab stats={stats} activities={activities || []} />
            )}
            {activeTab === "Members" && <CommunityMembers />}
            {activeTab === "Posts" && <CommunityPosts />}
        </div>
    );
}