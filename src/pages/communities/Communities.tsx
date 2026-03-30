import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { useModal } from "@/components/modal";
import { ActionModal, DateRangeModal } from "@/components/modal";
import { Pagination } from "@/components/pagination/Pagination";
import { COMMUNITY_TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constants/actions";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { mapCommunityToRowDTO, type CommunitiesRowDTO } from "@/features/communities/types/community.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunities, useCreateCommunity, useUpdateCommunity, useSuspendCommunity, useActivateCommunity, useSoftDeleteCommunity } from "@/features/communities";
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";
import { CommunityForm } from "@/features/communities/components/CommunityForm";

// CommunityForm extracted to src/features/communities/components/CommunityForm.tsx


interface EditCommunityModalProps {
    data: CommunitiesRowDTO & { id: number };
    close: () => void;
}

function EditCommunityModal({ data, close }: EditCommunityModalProps) {
    const { mutate: updateCommunity, isPending: isUpdating } = useUpdateCommunity(data.id.toString());

    return (
        <CommunityForm
            title="Edit Community"
            initialData={data}
            close={close}
            isPending={isUpdating}
            onSubmit={(formData) => {
                updateCommunity(formData, {
                    onSuccess: () => {
                        showSuccessToast("Community Updated", "Community details have been successfully updated.");
                        close();
                    },
                    onError: (err) => {
                        showErrorToast("Update Failed", getErrorMessage(err));
                        console.error(err);
                    }
                });
            }}
        />
    );
}

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
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { data, isLoading, isError, error } = useCommunities(page, PAGE_SIZE, searchTerm, startDate, endDate, statusFilter);
    const { mutateAsync: suspendCommunity } = useSuspendCommunity();
    const { mutateAsync: activateCommunity } = useActivateCommunity();
    const { mutateAsync: softDeleteCommunity } = useSoftDeleteCommunity();

    // Reset to page 1 when search term changes
    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (prevSearchTerm !== searchTerm) {
        setPrevSearchTerm(searchTerm);
        setPage(1);
    }

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: CommunitiesRowDTO[] = (() => {
        if (!data) return [];

        // The API returns communities in payload.communities
        const communities = (data as { payload?: { communities?: unknown[] } })?.payload?.communities || [];

        if (!Array.isArray(communities)) {
            console.warn('Communities data is not an array:', communities);
            return [];
        }

        return (communities as import("@/features/communities/types/community.types").CommunitiesApi[]).map(mapCommunityToRowDTO);
    })();

    const totalPages = data?.payload?.meta?.totalPages ?? 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<CommunitiesRowDTO>[] = [
        {
            key: COMMUNITY_TABLE_VARIANTE.NAME,
            header: COMMUNITY_TABLE_VARIANTE.NAME_HEADER,
        },
        {
            key: COMMUNITY_TABLE_VARIANTE.MEMBERS,
            header: COMMUNITY_TABLE_VARIANTE.MEMBERS_HEADER,
        },
        {
            key: COMMUNITY_TABLE_VARIANTE.VISIBILITY,
            header: COMMUNITY_TABLE_VARIANTE.VISIVILITY_HEADER,
        },
        {
            key: COMMUNITY_TABLE_VARIANTE.STATUS,
            header: COMMUNITY_TABLE_VARIANTE.STATUS_HEADER,
        },
        {
            key: COMMUNITY_TABLE_VARIANTE.JOINED_DATE,
            header: COMMUNITY_TABLE_VARIANTE.JOINED_DATE_HEADER,
        },
    ];
    const suspendCommunityFn = (communityId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.suspendedUserRed
                }}
                title="Suspend this community"
                description="Are you sure you want to suspend this community? Members will no longer be able to post, comment, or join until it is reactivated. Existing content will still remain visible unless you manually take it down."
                primaryLabel={ActionType.SUSPEND_COMMUNITY}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await suspendCommunity(communityId);
                        showSuccessToast("Community Suspended", "The community has been successfully suspended.");
                        close();
                    } catch (error) {
                        showErrorToast("Suspension Failed", getErrorMessage(error));
                    }
                }}
            />
        ));
    }

    const activateCommunityFn = (communityId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseGreen,
                    icon: AppIcons.usersgroupGreen
                }}
                title="Activate this community"
                description="This will restore the community. Members will be able to post, comment, and join again."
                primaryLabel={ActionType.ACTIVATE_COMMUNITY}
                primaryIntent="default"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await activateCommunity(communityId);
                        showSuccessToast("Community Activated", "The community has been successfully reactivated.");
                        close();
                    } catch (error) {
                        showErrorToast("Activation Failed", getErrorMessage(error));
                    }
                }}
            />
        ));
    }

    const deleteCommunityFn = (communityId: number, communityName: string) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="Delete community"
                description={`Are you sure you want to delete ${communityName}? This action will remove the community, all posts, comments, and member data associated with it. Once deleted, this community cannot be recovered.`}
                primaryLabel="Delete community"
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {
                    try {
                        await softDeleteCommunity(communityId.toString());
                        showSuccessToast("Community Deleted", "The community has been successfully deleted.");
                        close();
                    } catch (error) {
                        showErrorToast("Deletion Failed", getErrorMessage(error));
                    }
                }}
            />
        ));
    }
    /* ----------------------------
       ACTIONS
    ---------------------------- */
    const { mutate: createCommunity, isPending: isCreating } = useCreateCommunity();

    const openCreateComunityModal = () => {
        openModal(
            ({ close }) => (
                <CommunityForm
                    title="Create Community"
                    close={close}
                    isPending={isCreating}
                    onSubmit={(data) => {
                        createCommunity(data as unknown as import("@/features/communities/hooks/useCommunity").CreateCommunityPayload, {
                            onSuccess: () => {
                                showSuccessToast("Community Created", "New community has been successfully created.");
                                close();
                            },
                            onError: (err) => {
                                showErrorToast("Creation Failed", getErrorMessage(err));
                            }
                        });
                    }}
                />
            ), { type: 'side', width: 'w-[500px]' })
    }
    const openEditComunityModal = (EditData: CommunitiesRowDTO & { id: number }) => {
        openModal(
            ({ close }) => (
                <EditCommunityModal data={EditData} close={close} />
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
        // {
        //     label: ActionType.MANAGE_MODERATORS,
        //     icon: Appicon.user,
        //     onClick: (row) => console.log("Manage moderators", row.id),
        // },
        {
            label: ActionType.SUSPEND_COMMUNITY,
            icon: Appicon.unavailable,
            danger: true,
            onClick: (row) => {
                if (row.status === 'in-active') {
                    activateCommunityFn(row.id);
                } else {
                    suspendCommunityFn(row.id);
                }
            },
            // Dynamic label based on row status
            getLabel: (row: CommunitiesRowDTO) => row.status === 'in-active' ? ActionType.ACTIVATE_COMMUNITY : ActionType.SUSPEND_COMMUNITY,
            getIcon: (row: CommunitiesRowDTO) => row.status === 'in-active' ? Appicon.usersgroupGreen : Appicon.unavailable,
            getDanger: (row: CommunitiesRowDTO) => row.status !== 'in-active',
        },
        {
            label: ActionType.DELETE_COMMUNITY,
            icon: Appicon.delete_red,
            danger: true,
            onClick: (row) => deleteCommunityFn(row.id, row.Community_Name),
        },
    ];

    /* ----------------------------
       ERROR STATE
    ---------------------------- */
    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as Error)?.message ?? "Failed to load users"}
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
                { label: "Inactive", value: "deactivate", isSelected: statusFilter === 'deactivate' },
            ]
        },
        {
            label: "Date",
            value: "date",
            icon: AppIcons.calendar,
        }
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
                        <div className="grid  md:w-fit md:flex md:justify-end md:items-center md:gap-3">
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
