import { Pagination } from "@/components/pagination/Pagination";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { useUsers } from "@/features/users/hooks/useUsers";
import { mapUserToRowDTO, type UserRowDTO } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";
import { TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { Navigate, useNavigate } from "react-router-dom";
import { ActionModal } from "@/components/modal/actionModal";
import { useModal } from "@/components/modal";
import { BUTTON_TYPE } from "@/components/button/constants";
import { ActionType } from "@/constants/actions";

export default function Users() {
    const { openModal, } = useModal();

    const navigate = useNavigate();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search users by name or email...');
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

    function suspendUserFn() {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.suspendedUserRed
                }}
                title="Suspend user"
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

    /* ----------------------------
       ACTIONS
    ---------------------------- */
    const actions: TableAction<UserRowDTO>[] = [
        {
            label: ActionType.VIEW,
            icon: Appicon.eyeOpen,
            onClick: (row) => navigate(`/users/Details/${row.id}`),
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
            icon: AppIcons.calendar,
        },
        {
            label: "Status",
            value: "status",
            icon: AppIcons.lightning,
        },
        {
            label: "Role",
            value: "role",
            icon: AppIcons.user,
        },
    ];

    /* ----------------------------
       RENDER
    ---------------------------- */
    return (
        <>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div className="flex w-[343px] flex-col items-start gap-1 shrink-0 ">
                        <div className="text-[#0A0D14] text-center text-[19px] font-semibold">
                            User Management
                        </div>
                        <div className="text-[#666] text-center text-[13px] font-medium">
                            View and manage all platform users.
                        </div>
                    </div>
                    <div className="w-full flex items-center md:justify-end justify-start min-w-fit ">
                        <FilterDropdown options={filterOptions} onSelect={(value) => console.log(value.value)} />
                    </div>
                </div>


                <div className="w-full h-full">
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

            </div>
        </>
    );
}