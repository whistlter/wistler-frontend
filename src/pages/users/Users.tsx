import { Pagination } from "@/components/pagination/Pagination";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { useBlockUser, useActivateUser, useUsers } from "@/features/users/hooks/useUsers";
import { mapUserToRowDTO, type UserRowDTO } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";
import { USER_TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { useNavigate } from "react-router-dom";
import { ActionModal, DateRangeModal } from "@/components/modal";
import { useModal } from "@/components/modal";
import { BUTTON_TYPE } from "@/components/button/constants";
import { ActionType } from "@/constants/actions";
import { AxiosError } from "axios";
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";

export default function Users() {
    const { openModal } = useModal();
    const navigate = useNavigate();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();
    const { mutateAsync: blockUser } = useBlockUser();
    const { mutateAsync: activateUser } = useActivateUser();

    useEffect(() => {
        setPlaceholder('Search users by name or email...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const Appicon = { ...AppIcons }
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);

    if (searchTerm !== prevSearchTerm) {
        setPage(1);
        setPrevSearchTerm(searchTerm);
    }

    const { data, isLoading, isError, error } = useUsers(page, PAGE_SIZE, searchTerm, startDate, endDate, statusFilter);

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: UserRowDTO[] = data?.payload?.users?.map(mapUserToRowDTO) ?? [];
    const totalPages = data?.payload?.meta?.totalPages ?? 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<UserRowDTO>[] = [
        {
            key: USER_TABLE_VARIANTE.NAME,
            header: USER_TABLE_VARIANTE.NAME_HEADER,
        },
        {
            key: USER_TABLE_VARIANTE.USERNAME,
            header: USER_TABLE_VARIANTE.USERNAME_HEADER,
        },
        {
            key: USER_TABLE_VARIANTE.EMAIL,
            header: USER_TABLE_VARIANTE.EMAIL_HEADER,
        },
        {
            key: USER_TABLE_VARIANTE.COMMUNITIES,
            header: USER_TABLE_VARIANTE.COMMUNITIES_HEADER,
        },
        {
            key: USER_TABLE_VARIANTE.STATUS,
            header: USER_TABLE_VARIANTE.STATUS_HEADER,
        },
        {
            key: USER_TABLE_VARIANTE.JOINED_DATE,
            header: USER_TABLE_VARIANTE.JOINED_DATE_HEADER,
        },
    ];

    function suspendUserFn(userId: number) {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.suspendedUserRed
                }}
                title="Suspend user"
                description="This will temporarily block the user from accessing their account. They will not be able to sign in until reinstated."
                primaryLabel={ActionType.SUSPEND_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await blockUser(userId);
                        showSuccessToast("User Suspended", "The user has been successfully suspended.");
                        close();
                    } catch (error) {
                        showErrorToast("Suspension Failed", getErrorMessage(error));
                    }
                }}
            />
        ));
    }

    function activateUserFn(userId: number) {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseGreen,
                    icon: AppIcons.usersgroupGreen
                }}
                title="Activate User"
                description="This will restore the user's access to their account. They will be able to sign in and use the platform again."
                primaryLabel={ActionType.ACTIVATE_USER}
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await activateUser(userId);
                        showSuccessToast("User Activated", "The user account has been reactivated.");
                        close();
                    } catch (error) {
                        showErrorToast("Activation Failed", getErrorMessage(error));
                    }
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
            onClick: (row) => {
                if (row.status === 'blocked') {
                    activateUserFn(row.id);
                } else {
                    suspendUserFn(row.id);
                }
            },
            // Dynamic label based on row status
            getLabel: (row: UserRowDTO) => row.status === 'blocked' ? ActionType.ACTIVATE_USER : ActionType.SUSPEND_USER,
            getIcon: (row: UserRowDTO) => row.status === 'blocked' ? Appicon.usersgroupGreen : Appicon.unavailable,
            getDanger: (row: UserRowDTO) => row.status !== 'blocked',
        },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as AxiosError)?.message ?? "Failed to load users"}
            </div>
        );
    }

    const filterOptions: FilterOption[] = [
        {
            label: "Status",
            value: "status",
            icon: AppIcons.lightning,
            subOptions: [
                { label: "Active", value: "active", isSelected: statusFilter === 'active' },
                { label: "Blocked", value: "blocked", isSelected: statusFilter === 'blocked' },
            ]
        },
        {
            label: "Date",
            value: "date",
            icon: AppIcons.calendar,
        },
    ];

    const handleFilterSelect = (option: FilterOption) => {
        if (option.value === 'date') {
            openModal(({ close }) => (
                <DateRangeModal
                    close={close}
                    onApply={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                        setPage(1);
                    }}
                />
            ), { type: 'center' });
        }
    };

    const handleSubOptionSelect = (_parentOption: FilterOption, subOption: { value: string }) => {
        setStatusFilter(subOption.value);
        setPage(1);
    };

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
                    <div className="w-full flex items-center md:justify-end justify-start gap-3 min-w-fit flex-wrap">
                        {/* Active Status Filter Badge */}
                        {statusFilter !== 'all' && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#FCE7F3] border border-[#FCE7F3] rounded-lg">
                                <span className="text-sm font-medium text-[#BE185D] capitalize">
                                    {statusFilter}
                                </span>
                                <button
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setPage(1);
                                    }}
                                    className="text-[#BE185D] hover:text-[#9F1239] transition-colors cursor-pointer"
                                >
                                    <img src={AppIcons.x} alt="Clear" className="w-4 h-4 cursor-pointer" />
                                </button>
                            </div>
                        )}

                        {/* Active Date Filter Badge */}
                        {(startDate || endDate) && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#FCE7F3] border border-[#FCE7F3] rounded-lg">
                                <span className="text-sm font-medium text-[#BE185D]">
                                    {startDate} - {endDate}
                                </span>
                                <button
                                    onClick={() => {
                                        setStartDate('');
                                        setEndDate('');
                                        setPage(1);
                                    }}
                                    className="text-[#BE185D] hover:text-[#9F1239] transition-colors cursor-pointer"
                                >
                                    <img src={AppIcons.x} alt="Clear" className="w-4 h-4 cursor-pointer" />
                                </button>
                            </div>
                        )}

                        <FilterDropdown
                            options={filterOptions}
                            onSelect={handleFilterSelect}
                            onSubOptionSelect={handleSubOptionSelect}
                        />
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
