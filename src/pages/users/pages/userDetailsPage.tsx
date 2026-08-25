// src/pages/users/pages/userDetailsPage.tsx
import { useState } from "react";
import { UsercommunityTap } from "@/features/users/components/UsercommunityTap";
import { ActivitiesLog } from "@/components/activityLog/ActivitiesLog";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/button/Button";
import { ActionType } from "@/constants/actions";
import { Dropdown } from "@/components/dropdown/dropdown";
import { AppIcons } from "@/constants/constant";
import { BUTTON_TYPE } from "@/components/button/constants";
import type { dropdownOption } from "@/components/dropdown/types";
import { ActionModal } from "@/components/modal/actionModal";
import { useModal } from "@/components/modal";
import { useUser, useBlockUser, useActivateUser, useResetUserPassword } from "@/features/users/hooks/useUsers";
import { useModeration } from "@/features/moderation/hooks/useModerator";
import { statusToColor } from "@/utils/helper";
import { UserDetailsSkeleton } from "@/features/users/components/UserDetailsSkeleton";
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";
import { EmptyState } from "@/components/common/EmptyState";
import { UserX } from "lucide-react";

type Tab = "Communities" | "Activities";

export default function UserDetailsPage() {
    const { id: userId } = useParams<{ id: string }>();
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState<Tab>("Communities");

    // Fetch User Data
    const { data: userResponse, isLoading: isUserLoading, isError: isUserError, error: userError } = useUser(userId || "");
    const user = userResponse?.payload?.user;

    // Fetch Moderation/Activities
    const { stats, activities, isLoading: isModLoading } = useModeration();

    const { mutateAsync: blockUser } = useBlockUser();
    const { mutateAsync: activateUser } = useActivateUser();
    const { mutateAsync: resetPassword } = useResetUserPassword();

    const tabs = [
        { key: "Communities" as const, label: "Communities" },
        { key: "Activities" as const, label: "Activities" },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isUserError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                {(userError as Error)?.message ?? "Failed to load user data"}
            </div>
        );
    }

    /* ----------------------------
       LOADING STATE
    ---------------------------- */
    if (isUserLoading || isModLoading) {
        return <UserDetailsSkeleton />;
    }

    /* ----------------------------
       NO DATA STATE
    ---------------------------- */
    if (!user) {
        return (
            <div className="p-6">
                <EmptyState icon={UserX} title="No user data available" description="This user could not be found." />
            </div>
        );
    }

    const dropdownOptions: dropdownOption[] = [
        // {
        //     label: ActionType.SHADOW_BAN_USER,
        //     value: ActionType.SHADOW_BAN_USER,
        //     icon: AppIcons.eyeClosed,
        // },
        // {
        //     label: ActionType.BAN_USER,
        //     value: ActionType.BAN_USER,
        //     icon: AppIcons.exclamationGray,
        // },
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
                primaryLabel={ActionType.SUSPEND_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    if (userId) {
                        try {
                            await blockUser(userId);
                            showSuccessToast("User Suspended", "The user has been successfully suspended.");
                            close();
                        } catch (error) {
                            console.error(error);
                            showErrorToast("Suspension Failed", getErrorMessage(error));
                        }
                    } else {
                        close();
                    }
                }}
            />
        ));
    }

    const activateUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseGreen,
                    icon: AppIcons.usersgroupGreen
                }}
                title={ActionType.ACTIVATE_USER}
                description="This will restore the user's access to their account. They will be able to sign in and use the platform again."
                primaryLabel={ActionType.ACTIVATE_USER}
                primaryIntent="default"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    if (userId) {
                        try {
                            await activateUser(userId);
                            showSuccessToast("User Activated", "The user account has been reactivated.");
                            close();
                        } catch (error) {
                            console.error(error);
                            showErrorToast("Activation Failed", getErrorMessage(error));
                        }
                    } else {
                        close();
                    }
                }}
            />
        ));
    }


    // const banUserFn = () => {
    //     openModal(({ close }) => (
    //         <ActionModal
    //             close={close}
    //             icon={{
    //                 eclipse: AppIcons.eclipseYellow,
    //                 icon: AppIcons.warningYellow
    //             }}
    //             title="Ban user"
    //             description="Permanently blocks this user from the platform."
    //             primaryLabel={ActionType.BAN_USER}
    //             primaryIntent="danger"
    //             showLoader
    //             buttonVariant={BUTTON_TYPE.TETIARY}
    //             onPrimaryAction={async () => {
    //                 close();
    //             }}
    //         />
    //     ));
    // }

    const sendResetInstructionFn = () => {
        const name = `${user.first_name} ${user.last_name}`;
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.restoreRed
                }}
                title={`Reset password for ${name}`}
                description="Are you sure you want to reset this user’s password?"
                warningText="They will receive an email with instructions to create a new one. This will immediately invalidate their current password."
                primaryLabel={ActionType.SEND_RESET_INSTRUCTION}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {
                    if (userId) {
                        try {
                            await resetPassword(userId);
                            showSuccessToast("Reset Instructions Sent", `Password reset instructions sent to ${user.email}.`);
                            close();
                        } catch (error) {
                            console.error(error);
                            showErrorToast("Reset Failed", getErrorMessage(error));
                        }
                    } else {
                        close();
                    }
                }}
            />
        ));
    }

    const handleMoreOptions = (value: string) => {
        if (value === ActionType.RESET_PASSWORD) {
            sendResetInstructionFn();
        }
    }

    return (
        <div className="flex w-full flex-col py-4">
            {/* HEADER */}
            <div className=" grid grid-cols-1 lg:grid-cols-2 pb-6 gap-6">
                <div className="pl-6">
                    <p className=" flex text-[13px] font-normal text-[#666] my-2">
                        <NavLink to={'/users'}>Users</NavLink> <img src={AppIcons.chevronrightGrey} alt="" /> <span className="text-[#FF2860]">{`${user.first_name} ${user.last_name}`}</span>
                    </p>
                    <h1 className="text-[19px] font-semibold text-[#0A0D14] leading-tight">
                        Profile Details
                    </h1>
                </div>

                <div className="grid grid-cols-2 gap-6 self-center lg:flex lg:justify-end  px-6">
                    <div className="lg:w-70 sm:50">
                        {user.status === 'blocked' ? (
                            <Button leftIcon={AppIcons.usersgroupGreen} variant={BUTTON_TYPE.TETIARY} onClick={() => activateUserFn()}>
                                {ActionType.ACTIVATE_USER}
                            </Button>
                        ) : (
                            <Button leftIcon={AppIcons.unavailable} variant={BUTTON_TYPE.TETIARY} onClick={() => suspendUserFn()}>
                                {ActionType.SUSPEND_USER}
                            </Button>
                        )}
                    </div>
                    <div className="grid  md:w-fit md:flex md:justify-end md:itens-center">
                        <Dropdown options={dropdownOptions} onSelect={(val) => handleMoreOptions(val.value)} label="More options" LeftIcon={AppIcons.verticalThreeDot} />
                    </div>
                </div>
            </div>

            <div className="w-full bg-white px-8 py-6 border border-[#EFEFF3]">
                {/* Top section */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                        src={user.image || "https://i.pravatar.cc/100?img=12"}
                        alt={user.first_name}
                        className="h-14 w-14 rounded-full object-cover"
                    />

                    {/* Name + status */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[19px] font-semibold text-[#0A0D14]">
                                {user.first_name} {user.last_name}
                            </h2>

                            {/* Status pill */}
                            <span className={`inline-flex items-center gap-2 rounded-[5px] border px-3 py-1 text-sm
                                ${user.status === "Active"
                                    ? "border-green-200 bg-green-50 text-green-600"
                                    : "border-gray-300 bg-gray-50 text-gray-500"
                                }
                            `}>
                                <span
                                    className={`h-2 w-2 rounded-[2px] ${statusToColor(user.status)}`}
                                />
                                {user.status}
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#666]">
                            <img src={AppIcons.location} alt="" />
                            {user.country || "Unknown Location"}
                        </div>
                    </div>
                </div>

                {/* Meta info */}
                <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#666]">
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.calendar2} alt="" />
                        Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'N/A'}
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={AppIcons.activitygrey} alt="" />
                        Last Active: {user.last_active ? new Date(user.last_active).toLocaleString() : 'N/A'}
                    </div>
                </div>

                {/* Contact chips */}
                <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] px-4 py-3 text-[13px] font-medium text-[#666]">
                        <img src={AppIcons.mail} alt="" />
                        {user.email}
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] px-4 py-3 text-[13px] font-medium text-[#666]">
                        <img src={AppIcons.call} alt="" />
                        {user.country_code ? `+${user.country_code} ` : ''}{user.phone || 'N/A'}
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex self-stretch border-b border-[#E8E8E8] bg-white w-full">
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
            {activeTab === "Activities" && stats && (
                <ActivitiesLog activities={activities || []} />
            )}
            {activeTab === "Communities" && <UsercommunityTap />}
        </div>
    );
}