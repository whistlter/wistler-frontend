import { BUTTON_TYPE } from "@/components/button/constants";
import { useModal } from "@/components/modal";
import { ActionModal } from "@/components/modal/actionModal";
import { Pagination } from "@/components/pagination/Pagination";
import { USER_TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { useUserCommunities } from "@/features/users/hooks/useUsers";
import { mapUserCommunityToRowDTO, type UserCommunityRowDTO } from "@/features/users/types/user.types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function UsercommunityTap() {
    const navigate = useNavigate();
    const { id: userId } = useParams<{ id: string }>();

    const { openModal, } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search communities by name...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const Appicon = { ...AppIcons }
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;


    const { data, isLoading, isError, error } = useUserCommunities(userId || '', page, PAGE_SIZE, searchTerm);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: UserCommunityRowDTO[] = data?.payload?.userCommunitys?.map(mapUserCommunityToRowDTO) ?? [];

    const totalPages = data?.payload?.meta?.totalPages ?? 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<UserCommunityRowDTO>[] = [
        {
            key: USER_TABLE_VARIANTE.NAME,
            header: USER_TABLE_VARIANTE.NAME_HEADER,
        },
        {
            key: USER_TABLE_VARIANTE.ROLE,
            header: USER_TABLE_VARIANTE.ROLE_HEADER,
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

    /* ----------------------------
       ACTIONS
    ---------------------------- */
    const removeUserFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Remove user from community"
                description="This user will lose access to this community and its content. They can rejoin later if needed."
                primaryLabel="Remove user"
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const changeUserRoleFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.userRed
                }}
                title="Update user role"
                description="Choose the new role for this user. Their permissions will update immediately."
                primaryLabel="Update role"
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const actions: TableAction<UserCommunityRowDTO>[] = [
        {
            label: "View Community",
            icon: Appicon.eyeOpen,
            onClick: (row) => navigate(`/community/Details/${row.id}`),
        },
        {
            label: "Change role",
            icon: Appicon.user,
            onClick: (_row) => changeUserRoleFn(),
        },
        {
            label: "Remove user",
            icon: Appicon.unavailable,
            danger: true,
            onClick: (_row) => removeUserFn(),
        },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as any)?.message ?? "Failed to load communities"}
            </div>
        );
    }


    /* ----------------------------
       RENDER
    ---------------------------- */
    return (
        <>
            <div className="px-6">
                <div className="pt-6">
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
