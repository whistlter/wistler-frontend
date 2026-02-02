import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { FilterDropdown } from "@/components/filter/FilterDropdown";
import type { FilterOption } from "@/components/filter/types";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { useModal } from "@/components/modal";
import { ActionModal, DateRangeModal } from "@/components/modal";
import { Pagination } from "@/components/pagination/Pagination";
import { SelectComponent } from "@/components/select/selectComponent";
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
import FileUpload from "@/components/fileUpload/upload";
import { showSuccessToast, showErrorToast } from "@/components/common/toastUtils";

interface CommunityFormData {
    Community_Name?: string;
    description?: string;
    category?: string;
    Visibility?: string;
    visibility?: string;
    owner?: string;
}

interface CommunityFormProps {
    initialData?: CommunityFormData;
    close: () => void;
    onSubmit: (data: Record<string, unknown>) => void;
    isPending: boolean;
    title: string;
}

function CommunityForm({ initialData, close, onSubmit, isPending, title }: CommunityFormProps) {
    const [name, setName] = useState(initialData?.Community_Name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [visibility, setVisibility] = useState(initialData?.Visibility || initialData?.visibility || "Public");
    const [owner, setOwner] = useState(initialData?.owner || "");
    const [image, setImage] = useState<File | null>(null);

    // Map category to interest_id
    const categoryToInterestId: Record<string, string> = {
        'Technology': '7',
        'Business': '8',
        'Lifestyle': '9',
        'Education': '10',
    };

    // Map owner to user_id
    const ownerToUserId: Record<string, string> = {
        'User 1': '1',
        'User 2': '2',
        'User 3': '3',
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            showErrorToast("Validation Error", "Community name is required");
            return;
        }
        // Map UI fields to API payload format
        onSubmit({
            title: name,
            desc: description,
            interest_id: categoryToInterestId[category] || '',
            visibility: visibility.toLowerCase(),
            is_safe_space: 'no',
            is_member_screening: 'no',
            can_post_anonymously: 'no',
            user_id: ownerToUserId[owner] || '1',
            image: image,
        });
    };

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="shrink-0 border-b border-[#E8E8E8] px-6 py-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button onClick={close} className="cursor-pointer">
                    <img src={AppIcons.x} alt="Close" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Community Name</label>
                    <FormInput
                        placeholder="Enter name"
                        type={INPUT_TYPES.TEXT}
                        value={name}
                        onChange={setName}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Description</label>
                    <FormInput
                        placeholder="Enter description"
                        type={INPUT_TYPES.TEXTAREA}
                        value={description}
                        onChange={setDescription}
                    />
                </div>

                <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2">Category</label>
                    <SelectComponent
                        data={['Technology', 'Business', 'Lifestyle', 'Education']}
                        placeholder="Select"
                        value={category}
                        onChange={(val) => setCategory(val as string)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Image</label>
                    <FileUpload onFileSelect={setImage} />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Visibility</label>
                    <SelectComponent
                        data={['Public', 'Private']}
                        placeholder="Select Visibility"
                        value={visibility}
                        onChange={(val) => setVisibility(val as string)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Owner Assignment</label>
                    <p className="text-[13px] text-[#969696] mb-2">Select a user to own and manage this community.</p>
                    <SelectComponent
                        data={['User 1', 'User 2', 'User 3']}
                        placeholder="Select User"
                        value={owner}
                        onChange={(val) => setOwner(val as string)}
                    />
                </div>
            </div>

            <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-6 py-5">
                <div className="flex gap-3">
                    <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={isPending}>
                        {initialData ? "Update Community" : "Create Community"}
                    </Button>
                </div>
            </div>
        </div>
    );
}


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
                        showErrorToast("Update Failed", "Failed to update community details.");
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

    const totalPages = (() => {
        if (!data) return 1;

        // API returns pagination info in payload.meta
        const meta = (data as { payload?: { meta?: { total?: number } } })?.payload?.meta;
        const total = meta?.total || 0;

        if (typeof total === 'number' && total > 0) {
            return Math.ceil(total / PAGE_SIZE);
        }
        return 1;
    })();

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
                        console.error(error);
                        showErrorToast("Suspension Failed", "Failed to suspend community.");
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
                        console.error(error);
                        showErrorToast("Activation Failed", "Failed to activate community.");
                    }
                }}
            />
        ));
    }

    const deleteCommunityFn = (communityId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.delete_red
                }}
                title="Delete this community"
                description="Are you sure you want to delete this community? This action will remove the community and all its content. Members will lose access immediately."
                primaryLabel={ActionType.DELETE_COMMUNITY}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await softDeleteCommunity(communityId);
                        showSuccessToast("Community Deleted", "The community has been successfully deleted.");
                        close();
                    } catch (error) {
                        console.error(error);
                        showErrorToast("Deletion Failed", "Failed to delete community.");
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
                        createCommunity(data, {
                            onSuccess: () => {
                                showSuccessToast("Community Created", "New community has been successfully created.");
                                close();
                            },
                            onError: (err) => {
                                showErrorToast("Creation Failed", "Failed to create community. Please try again.");
                                console.error(err);
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
            onClick: (row) => deleteCommunityFn(row.id),
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
                { label: "All", value: "all", isSelected: statusFilter === 'all' },
                { label: "Active", value: "active", isSelected: statusFilter === 'active' },
                { label: "Deactivate", value: "deactivate", isSelected: statusFilter === 'deactivate' },
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
