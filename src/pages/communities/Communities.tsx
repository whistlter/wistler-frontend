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
import { mapUserToRowDTO, type CommunitiesRowDTO } from "@/features/users/types/comunity.type";
import type { UserRowDTO } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Communities() {
    const navigate = useNavigate();
    const { openModal, } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search Communities by Name or Email...');
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
    const columns: TableColumn<CommunitiesRowDTO>[] = [
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
    const suspendCommunityFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Suspend this community"
                description="Are you sure you want to suspend backyard by tony?
                Members will no longer be able to post,
                comment, or join until it is reactivated. Existing content will still remain visible unless you manually take it down."
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.SUSPEND_COMMUNITY}
                primaryIntent="danger"
                showLoader
                buttonType={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    /* ----------------------------
       ACTIONS
    ---------------------------- */
    const openCreateComunityModal = () => {
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
                            <FormInput placeholder="Enter description" type={INPUT_TYPES.TEXTAREA} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <SelectComponent data={['option1', 'option2']} placeholder="Select" />
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
                            <SelectComponent data={['option1', 'option2']} placeholder="Select Visibility" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Assignment
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Select a user to own and manage this community.
                            </p>
                            <SelectComponent data={['option1', 'option2']} placeholder="Select User" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Moderators
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Choose one or more Moderators
                            </p>
                            <SelectComponent data={['option1', 'option2']} placeholder="Select Moderator" />
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
    const openEditComunityModal = (EditData: any) => {
        console.log(EditData)
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
                            <FormInput placeholder="Enter description" type={INPUT_TYPES.TEXTAREA} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <SelectComponent data={['option1', 'option2']} placeholder="Select" />
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
                            <SelectComponent data={['option1', 'option2']} placeholder="Select Visibility" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Assignment
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Select a user to own and manage this community.
                            </p>
                            <SelectComponent data={['option1', 'option2']} placeholder="Select User" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Moderators
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Choose one or more Moderators
                            </p>
                            <SelectComponent data={['option1', 'option2']} placeholder="Select Moderator" />
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
    const actions: TableAction<CommunitiesRowDTO>[] = [
        {
            label: ActionType.VIEW_COMMUNITY,
            icon: Appicon.eyeOpen,
            onClick: (row) => navigate(`/community/Details/${row.id}`),
        },
        {
            label: ActionType.EDIT,
            icon: Appicon.edit,
            onClick: (row) => openEditComunityModal(row),
        },
        {
            label: ActionType.MANAGE_MODERATORS,
            icon: Appicon.user,
            onClick: (row) => console.log("Suspend user", row.id),
        },
        {
            label: ActionType.SUSPEND_COMMUNITY,
            icon: Appicon.unavailable,
            danger: true,
            onClick: (row) => suspendCommunityFn(),
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
            icon: AppIcons.calendar,
        },
        {
            label: "Status",
            value: "status",
            icon: AppIcons.lightning,
        }
    ];

    /* ----------------------------
       RENDER
    ---------------------------- */
    return (
        <>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 pb-6 gap-6">
                    <div className="flex w-30 lg:w-fit sm:w-70  flex-col items-start gap-1 shrink-0">
                        <div className="text-[#0A0D14] text-center text-[19px] font-semibold">
                            Communities
                        </div>
                        <div className="flext text-[#666]  text-[13px] font-medium w-fit">
                            Manage all communities, owners, visibility, and moderation settings.
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 self-center lg:flex lg:justify-end ">
                        <div className="grid  md:w-fit md:flex md:justify-end md:itens-center">
                            <FilterDropdown options={filterOptions} onSelect={(value) => console.log(value.value)} />
                        </div>
                        <div className="lg:w-70 sm:50">
                            <Button leftIcon={Appicon.plus_cicle} onClick={() => openCreateComunityModal()}>
                                Create community
                            </Button>
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
