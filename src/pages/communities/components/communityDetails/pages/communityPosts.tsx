import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { useModal } from "@/components/modal";
import { ActionModal } from "@/components/modal/actionModal";
import { Pagination } from "@/components/pagination/Pagination";
import { SelectComponent } from "@/components/select/selectComponent";
import { TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constant/actions";
import { AppIcons } from "@/constant/constant";
import { useSearchStore } from "@/features/shared-store/generalStore";
import { useUsers } from "@/features/users/hooks/useUsers";
import { mapUserToRowDTO, type UserRowDTO } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";

export function CommunityPosts() {
    const { openModal, } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search Review Queue by Name or Email...');
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
    const viewpostFn = (data: any) => {
        openModal(
            ({ close }) => (
                <div className="flex h-full flex-col bg-white">
                    {/* HEADER (FIXED) */}
                    <div className="shrink-0 border-b border-[#E8E8E8] px-6 py-5 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            Create Community
                        </h2>
                        <button onClick={close} className="cursor-pointer">
                            <img src={Appicon.x} alt="Close" />
                        </button>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Community Name
                            </label>
                            <FormInput placeholder="Enter name" type={INPUT_TYPES.TEXT} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <FormInput placeholder="Enter description" type={INPUT_TYPES.TEXTAREA} disabled={true} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <SelectComponent data={['option1', 'option2']} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400 mb-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-sm text-gray-600">
                                    Attach photo or take a picture
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    jpg, jpeg, png • up to 2mb
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visibility
                            </label>
                            <SelectComponent data={['option1', 'option2']} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Assignment
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Select a user to own and manage this community.
                            </p>
                            <SelectComponent data={['option1', 'option2']} />
                        </div>
                    </div>

                    {/* FOOTER (FIXED) */}
                    <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-6 py-5">
                        <div className="flex gap-3">
                            <Button onClick={close} type={BUTTON_TYPE.SECONDARY}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    alert("Community created!");
                                    close();
                                }}
                            >
                                Create community
                            </Button>
                        </div>
                    </div>
                </div>

            ), { type: 'side', width: 'w-[500px]' })
    }
    const moveToReviewFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Move to review"
                description="This hides the content and places it into the review queue for further investigation."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.MOVE_TO_REVIEW}
                primaryIntent="danger"
                showLoader
                buttonType={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const deleteContentFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Delete content"
                description="This permanently removes the content from the platform."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.DELETE}
                primaryIntent="danger"
                showLoader
                buttonType={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }


    const actions: TableAction<UserRowDTO>[] = [
        {
            label: ActionType.VIEW_POST,
            icon: Appicon.eyeOpen,
            onClick: (row) => viewpostFn(row),
        },
        {
            label: ActionType.MOVE_TO_REVIEW,
            icon: Appicon.user,
            onClick: (row) => moveToReviewFn(),
        },
        {
            label: ActionType.DELETE,
            icon: Appicon.delete_red,
            danger: true,
            onClick: (row) => deleteContentFn(),
        }
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
                <div className="py-6">
                    <Table
                        data={rows}
                        columns={columns}
                        actions={actions}
                        loading={isLoading}
                    />
                </div>

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