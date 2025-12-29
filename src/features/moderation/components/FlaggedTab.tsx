import { BUTTON_TYPE } from "@/components/button/constants";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { useModal } from "@/components/modal";
import { ActionModal } from "@/components/modal/actionModal";
import { Pagination } from "@/components/pagination/Pagination";
import { TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constants/actions";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { useUsers } from "@/features/users/hooks/useUsers";
import { mapUserToRowDTO, type UserRowDTO } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";

export function FlaggedTab() {
    const { openModal, } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search Flagged Content by name or email...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const Appicon = { ...AppIcons }
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;


    const { data, isLoading, isError, error } = useUsers(page, PAGE_SIZE, searchTerm);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: UserRowDTO[] = data?.data.map(mapUserToRowDTO) ?? [];

    const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<UserRowDTO>[] = [
        {
            key: TABLE_VARIANTE.NAME,
            header: TABLE_VARIANTE.NAME_HEADER,
        },
        {
            key: TABLE_VARIANTE.EMAIL,
            header: TABLE_VARIANTE.EMAIL_HEADER,
        },
        {
            key: TABLE_VARIANTE.COMMUNITIES,
            header: TABLE_VARIANTE.COMMUNITIES_HEADER,
        },
        {
            key: TABLE_VARIANTE.STATUS,
            header: TABLE_VARIANTE.STATUS_HEADER,
        },
        {
            key: TABLE_VARIANTE.JOINED_DATE,
            header: TABLE_VARIANTE.JOINED_DATE_HEADER,
        },
    ];

    /* ----------------------------
       ACTIONS
    ---------------------------- */
    const takeDownFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Take down content"
                description="This removes the content from public view. The creator will not be notified automatically."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.TAKE_DOWN}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const moveToReviewFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Take down content"
                description="This hides the content and places it into the review queue for further investigation."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.MOVE_TO_REVIEW}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
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
    const shadowBanUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Shadowban User"
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
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }

    const actions: TableAction<UserRowDTO>[] = [
        {
            label: ActionType.TAKE_DOWN,
            icon: Appicon.achiveArrowDown,
            onClick: (row) => takeDownFn(),
        },
        {
            label: ActionType.MOVE_TO_REVIEW,
            icon: Appicon.propertySearch,
            onClick: (row) => moveToReviewFn(),
        },
        {
            label: ActionType.BAN_USER,
            icon: Appicon.exclamationGray,
            onClick: (row) => banUserFn(),
        },
        {
            label: ActionType.SHADOW_BAN,
            icon: Appicon.eyeClosed,
            onClick: (row) => shadowBanUserFn(),
        },
        {
            label: ActionType.SUSPEND_USER,
            icon: Appicon.unavailable,
            danger: true,
            onClick: (row) => suspendUserFn(),
        },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as any)?.message ?? "Failed to load users"}
            </div>
        );
    }
    const filterOptions: FilterOption[] = [
        {
            label: "Date",
            value: "date",
            icon: <span>📅</span>,
        },
        {
            label: "Status",
            value: "status",
            icon: <span>⚡</span>,
        },
        {
            label: "Role",
            value: "role",
            icon: <span>👤</span>,
        },
    ];

    /* ----------------------------
       RENDER
    ---------------------------- */
    return (
        <>
            <div className="px-6">
                <div className="flex w-full justify-between items-center pb-6">
                    <div className="flex w-full flex-col items-start gap-1 shrink-0 pt-6">
                        <div className="text-[#666] text-center text-[13px] font-medium">
                            Content automatically or manually flagged for review
                        </div>
                    </div>
                </div>
                <Table
                    data={rows}
                    columns={columns}
                    actions={actions}
                    loading={isLoading}
                />

                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </>
    );
}