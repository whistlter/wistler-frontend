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
import { COMMUNITY_TABLE_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constants/actions";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { mapCommunityToRowDTO, type CommunitiesRowDTO } from "@/features/communities/types/community.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunities, useCreateCommunity, useUpdateCommunity } from "@/features/communities";
import FileUpload from "@/components/fileUpload/upload";
import { toast } from "react-hot-toast";

interface CommunityFormProps {
    initialData?: any;
    close: () => void;
    onSubmit: (data: any) => void;
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

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Community name is required");
            return;
        }
        onSubmit({
            community_Name: name,
            description,
            category,
            Visibility: visibility,
            owner,
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


    const { data, isLoading, isError, error } = useCommunities(page, PAGE_SIZE, searchTerm);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    /* ----------------------------
       ROWS
    ---------------------------- */
    const rows: CommunitiesRowDTO[] = data?.payload?.data?.map(mapCommunityToRowDTO) ?? [];

    const totalPages = (data?.payload && typeof data.payload.total === 'number')
        ? Math.ceil(data.payload.total / PAGE_SIZE)
        : 1;

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
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {

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
                                toast.success("Community created successfully!");
                                close();
                            },
                            onError: (err) => {
                                toast.error("Failed to create community");
                                console.error(err);
                            }
                        });
                    }}
                />
            ), { type: 'side', width: 'w-[500px]' })
    }
    const openEditComunityModal = (EditData: any) => {
        openModal(
            ({ close }) => {
                const { mutate: updateCommunity, isPending: isUpdating } = useUpdateCommunity(EditData.id);

                return (
                    <CommunityForm
                        title="Edit Community"
                        initialData={EditData}
                        close={close}
                        isPending={isUpdating}
                        onSubmit={(data) => {
                            updateCommunity(data, {
                                onSuccess: () => {
                                    toast.success("Community updated successfully!");
                                    close();
                                },
                                onError: (err) => {
                                    toast.error("Failed to update community");
                                    console.error(err);
                                }
                            });
                        }}
                    />
                );
            }, { type: 'side', width: 'w-[500px]' })
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
            onClick: (_row) => suspendCommunityFn(),
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
