import { BUTTON_TYPE } from "@/components/button/constants";
import type { FilterOption } from "@/components/filter/types";
import { useModal } from "@/components/modal";
import { ActionModal } from "@/components/modal/actionModal";
import { Pagination } from "@/components/pagination/Pagination";
import { COMMUNITY_MEMBERS_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constants/actions";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapCommunityMembersToRowDTO, type CommunitiesMembersRowDTO } from "@/features/communities/types/communityMember.types";
import { useCommunitiesMembers } from "@/features/communities/hooks/useCommunityMembers";

export function CommunityMembers() {
    const navigate = useNavigate();
    const { openModal, } = useModal();

    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search Flagged Content by name or email...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const Appicon = { ...AppIcons }
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;


    const { data, isLoading, isError, error } = useCommunitiesMembers(page, PAGE_SIZE, searchTerm);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: CommunitiesMembersRowDTO[] = data?.data.map(mapCommunityMembersToRowDTO) ?? [];

    const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<CommunitiesMembersRowDTO>[] = [
        {
            key: COMMUNITY_MEMBERS_VARIANTE.NAME,
            header: COMMUNITY_MEMBERS_VARIANTE.NAME_HEADER,
        },
        {
            key: COMMUNITY_MEMBERS_VARIANTE.ROLE,
            header: COMMUNITY_MEMBERS_VARIANTE.ROLE_HEADER,
        },
        {
            key: COMMUNITY_MEMBERS_VARIANTE.POSTS,
            header: COMMUNITY_MEMBERS_VARIANTE.POST_HEADER,
        },
        {
            key: COMMUNITY_MEMBERS_VARIANTE.LAST_SEEN,
            header: COMMUNITY_MEMBERS_VARIANTE.LAST_SEEN_HEADER,
        },
        {
            key: COMMUNITY_MEMBERS_VARIANTE.STATUS,
            header: COMMUNITY_MEMBERS_VARIANTE.STATUS_HEADER,
        },
        {
            key: COMMUNITY_MEMBERS_VARIANTE.JOINED_DATE,
            header: COMMUNITY_MEMBERS_VARIANTE.JOINED_DATE_HEADER,
        },
    ];

    /* ----------------------------
       ACTIONS
    ---------------------------- */
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
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.UPDATE_ROLE}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
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
                // warningText="All posts and members will be permanently removed."
                primaryLabel={ActionType.REMOVE_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const actions: TableAction<CommunitiesMembersRowDTO>[] = [
        {
            label: ActionType.VIEW_PROFILE,
            icon: Appicon.eyeOpen,
            onClick: (row) => navigate(`/users/Details/${row.id}`),
        },
        {
            label: ActionType.CHANGE_ROLE,
            icon: Appicon.user,
            onClick: (row) => changeUserRoleFn(),
        },
        {
            label: ActionType.REMOVE_USER,
            icon: Appicon.unavailable,
            danger: true,
            onClick: (row) => removeUserFn(),
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