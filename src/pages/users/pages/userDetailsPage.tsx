// src/features/moderation/ModerationPage.tsx
import { useModeration } from "@/features/moderation/hooks/useModerator";
import { useState } from "react";
import { UsercommunityTap } from "@/features/users/components/UsercommunityTap";
import { ActivitiesLog } from "@/components/activityLog/ActivitiesLog";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/button/Button";
import { ActionType } from "@/constants/actions";
import { Dropdown } from "@/components/dropdown/dropdown";
import { AppIcons } from "@/constants/constant";
import { BUTTON_TYPE } from "@/components/button/constants";
import type { dropdownOption } from "@/components/dropdown/types";
import { ActionModal } from "@/components/modal/actionModal";
import { useModal } from "@/components/modal";



type Tab = "Communities" | "Activities";

export default function UserDetailsPage() {
    const { openModal, } = useModal();
    const [activeTab, setActiveTab] = useState<Tab>("Communities");
    const { stats, activities, isLoading, isError, error } = useModeration();

    const tabs = [
        { key: "Communities" as const, label: "Communities" },
        { key: "Activities" as const, label: "Activities" },

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
    const dropdownOption: dropdownOption[] = [
        {
            label: ActionType.SHADOW_BAN_USER,
            value: ActionType.SHADOW_BAN_USER,
            icon: AppIcons.eyeClosed,
        },
        {
            label: ActionType.BAN_USER,
            value: ActionType.BAN_USER,
            icon: AppIcons.exclamationGray,
        },
        {
            label: ActionType.RESET_PASSWORD,
            value: ActionType.RESET_PASSWORD,
            icon: AppIcons.reset,
        },
    ];
    const suspendUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.suspendedUserRed
                }}
                title={ActionType.SUSPEND_USER}
                description="This will temporarily block the user from accessing their account. They will not be able to sign in until reinstated."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.SUSPEND_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const shadowBanUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title={ActionType.SHADOW_BAN_USER}
                description="The user can still post, but nobody else will see their content."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.SHADOW_BAN}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const banUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Ban user"
                description="Permanently blocks this user from the platform."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.BAN_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const sendResetInstructionFn = () => {
        const name = 'Samuel Emmanuel';
        openModal(({ close }) => (

            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.restoreRed
                }}
                title={`Reset password for ${name}`}
                description="Are you sure you want to reset this user’s password?"
                warningText="They will receive an email with instructions to create a new one.
This will immediately invalidate their current password."
                primaryLabel={ActionType.SEND_RESET_INSTRUCTION}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }


    const filterOptionFnc = (value: string) => {
        console.log(value)
        if (value === ActionType.RESET_PASSWORD) {
            sendResetInstructionFn();
        } else if (value === ActionType.BAN_USER) {
            banUserFn()
        } else {
            shadowBanUserFn()
        }
    }
    /* ----------------------------
       RENDER
    ---------------------------- */
    return (
        <div className="flex w-full flex-col py-4">
            {/* HEADER */}
            <div className=" grid grid-cols-1 lg:grid-cols-2 pb-6 gap-6">
                <div className="pl-6">
                    <p className=" flex text-[13px] font-normal text-[#666] my-2">
                        <NavLink to={'/users'}>Users</NavLink> <img src={AppIcons.chevronrightGrey} alt="" /> <span className="text-[#FF2860]">{'Oliver Bennett'}</span>
                    </p>
                    <h1 className="text-[19px] font-semibold text-[#0A0D14] leading-tight">
                        Profile Details
                    </h1>

                </div>

                <div className="grid grid-cols-2 gap-6 self-center lg:flex lg:justify-end  px-6">
                    <div className="lg:w-70 sm:50">
                        <Button leftIcon={AppIcons.unavailable} variant={BUTTON_TYPE.TETIARY} onClick={() => suspendUserFn()}>
                            {ActionType.SUSPEND_COMMUNITY}
                        </Button>
                    </div>
                    <div className="grid  md:w-fit md:flex md:justify-end md:itens-center">
                        <Dropdown options={dropdownOption} onSelect={(value) => filterOptionFnc(value.value)} label="More options" LeftIcon={AppIcons.verticalThreeDot} />

                    </div>
                </div>
            </div>
            <div className="w-full  bg-white px-8 py-6 border border-[#EFEFF3]">
                {/* Top section */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                        src="https://i.pravatar.cc/100?img=12"
                        alt="Oliver Bennett"
                        className="h-14 w-14 rounded-full object-cover"
                    />

                    {/* Name + status */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[19px] font-semibold text-[#0A0D14]">
                                Oliver Bennett
                            </h2>

                            {/* Status pill */}
                            <div className="flex items-center gap-2 rounded-[5px] border border-[#E8E8E8] px-3 py-1 text-[13px] font-medium text-[#666]">
                                <span className="h-[6px] w-[6px] rounded-[1px] bg-[#57A523]" />
                                Active
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#666]">
                            <img src={AppIcons.location} alt="" />
                            Melbourne, Australia
                        </div>
                    </div>
                </div>

                {/* Meta info */}
                <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#666]">
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.calendar2} alt="" />
                        Joined: January 2024
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.activitygrey} alt="" />
                        Last Active: 2 days ago
                    </div>
                </div>

                {/* Contact chips */}
                <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] px-4 py-3 text-[13px] font-medium text-[#666]">
                        <img src={AppIcons.mail} alt="" />
                        bennettoliver@gmail.com
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] px-4 py-3 text-[13px] font-medium text-[#666]">
                        <img src={AppIcons.call} alt="" />
                        +234 8130 466 995
                    </div>
                </div>
            </div>
            {/* TABS */}
            <div className="flex  self-stretch  border-b   border-[#E8E8E8] bg-white w-full">
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
            {activeTab === "Activities" && (
                <ActivitiesLog stats={stats} activities={activities || []} />
            )}
            {activeTab === "Communities" && <UsercommunityTap />}
        </div>
    );
}