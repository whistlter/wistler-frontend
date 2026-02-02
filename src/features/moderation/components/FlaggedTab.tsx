import { BUTTON_TYPE } from "@/components/button/constants";
import { useModal } from "@/components/modal";
import { ActionModal } from "@/components/modal/actionModal";
import { Pagination } from "@/components/pagination/Pagination";
import { FLAGGED_CONTENT_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constants/actions";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { useFlaggedContent } from "@/features/moderation/hooks/useModerator";
import { mapFlaggedContentToRowDTO, type FlaggedContentRowDTO } from "@/features/moderation/types/moderation.types";
import { useEffect, useState } from "react";

export function FlaggedTab() {
    const { openModal, } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search Flagged Content by content, community or reason...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const Appicon = { ...AppIcons }
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;


    const { data, isLoading, isError, error } = useFlaggedContent(page, PAGE_SIZE, searchTerm);

    // Reset to page 1 when search term changes
    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (prevSearchTerm !== searchTerm) {
        setPrevSearchTerm(searchTerm);
        setPage(1);
    }

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: FlaggedContentRowDTO[] = data?.data.map(mapFlaggedContentToRowDTO) ?? [];

    const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<FlaggedContentRowDTO>[] = [
        {
            key: FLAGGED_CONTENT_VARIANTE.CONTENT_PREVIEW,
            header: FLAGGED_CONTENT_VARIANTE.CONTENT_PREVIEW_HEADER,
        },
        {
            key: FLAGGED_CONTENT_VARIANTE.REASON,
            header: FLAGGED_CONTENT_VARIANTE.REASON_HEADER,
        },
        {
            key: FLAGGED_CONTENT_VARIANTE.FLAGS,
            header: FLAGGED_CONTENT_VARIANTE.FLAGS_HEADER,
        },
        {
            key: FLAGGED_CONTENT_VARIANTE.COMMUNITY,
            header: FLAGGED_CONTENT_VARIANTE.COMMUNITY_HEADER,
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
                primaryLabel={ActionType.SUSPEND_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }

    const actions: TableAction<FlaggedContentRowDTO>[] = [
        {
            label: ActionType.TAKE_DOWN,
            icon: Appicon.achiveArrowDown,
            onClick: () => takeDownFn(),
        },
        {
            label: ActionType.MOVE_TO_REVIEW,
            icon: Appicon.propertySearch,
            onClick: () => moveToReviewFn(),
        },
        {
            label: ActionType.BAN_USER,
            icon: Appicon.exclamationGray,
            onClick: () => banUserFn(),
        },
        {
            label: ActionType.SHADOW_BAN,
            icon: Appicon.eyeClosed,
            onClick: () => shadowBanUserFn(),
        },
        {
            label: ActionType.SUSPEND_USER,
            icon: Appicon.unavailable,
            danger: true,
            onClick: () => suspendUserFn(),
        },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as Error)?.message ?? "Failed to load flagged content"}
            </div>
        );
    }
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