import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { useModal } from "@/components/modal";
import { ActionModal } from "@/components/modal/actionModal";
import { Pagination } from "@/components/pagination/Pagination";
import { SelectComponent } from "@/components/select/selectComponent";
import { COMMUNITY_POST_VARIANTE } from "@/components/table/enum/TableEnum";
import { Table } from "@/components/table/Table";
import type { TableAction, TableColumn } from "@/components/table/types";
import { ActionType } from "@/constants/actions";
import { AppIcons } from "@/constants/constant";
import { useSearchStore } from "@/stores/searchStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mapCommunityPostToRowDTO, type CommunitiesPostRowDTO } from "@/features/communities/types/communityPost.types";
import { useCommunitiesPost, useSoftDeletePost } from "@/features/communities/hooks/useCommunityPost";
import { showSuccessToast, showErrorToast } from "@/components/common/toastUtils";

export function CommunityPosts() {
    const { id } = useParams<{ id: string }>();
    const { openModal, } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search posts by caption or author...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const Appicon = { ...AppIcons }
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    const [startDate] = useState<string>('');
    const [endDate] = useState<string>('');
    const [statusFilter] = useState<string>('all');


    const { data, isLoading, isError, error } = useCommunitiesPost(id || '', page, PAGE_SIZE, searchTerm, startDate, endDate, statusFilter);
    const { mutateAsync: softDeletePost } = useSoftDeletePost();

    // Reset to page 1 when search term changes
    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (prevSearchTerm !== searchTerm) {
        setPrevSearchTerm(searchTerm);
        setPage(1);
    }

    /* ----------------------------
       ROWS
    ---------------------------- */
    const posts = data?.payload?.posts || [];
    const rows: CommunitiesPostRowDTO[] = posts.map(mapCommunityPostToRowDTO);

    const totalPages = data?.payload?.meta?.totalPages ?? 1;

    /* ----------------------------
       COLUMNS
    ---------------------------- */
    const columns: TableColumn<CommunitiesPostRowDTO>[] = [
        {
            key: COMMUNITY_POST_VARIANTE.CAPTION,
            header: COMMUNITY_POST_VARIANTE.CAPTION_HEADER,
        },
        {
            key: COMMUNITY_POST_VARIANTE.AUTHOR,
            header: COMMUNITY_POST_VARIANTE.AUTHOR_HEADER,
        },
        {
            key: COMMUNITY_POST_VARIANTE.FLAGS,
            header: COMMUNITY_POST_VARIANTE.FLAGS_HEADER,
        },
        {
            key: COMMUNITY_POST_VARIANTE.STATUS,
            header: COMMUNITY_POST_VARIANTE.STATUS_HEADER,
        },
        {
            key: COMMUNITY_POST_VARIANTE.POSTED_ON,
            header: COMMUNITY_POST_VARIANTE.POSTED_ON_HEADER,
        },
    ];

    /* ----------------------------
       ACTIONS
    ---------------------------- */
    const viewpostFn = () => {
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
                            <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
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
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {

                }}
            />
        ));
    }
    const deleteContentFn = (postId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseRed,
                    icon: AppIcons.delete_red
                }}
                title="Delete content"
                description="This permanently removes the content from the platform."
                primaryLabel={ActionType.DELETE}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await softDeletePost(postId);
                        showSuccessToast("Post Deleted", "The post has been successfully deleted.");
                        close();
                    } catch (error) {
                        console.error("Failed to delete post:", error);
                        showErrorToast("Deletion Failed", "Failed to delete the post. Please try again.");
                    }
                }}
            />
        ));
    }


    const actions: TableAction<CommunitiesPostRowDTO>[] = [
        {
            label: ActionType.VIEW_POST,
            icon: Appicon.eyeOpen,
            onClick: () => viewpostFn(),
        },
        {
            label: ActionType.MOVE_TO_REVIEW,
            icon: Appicon.user,
            onClick: () => moveToReviewFn(),
        },
        {
            label: ActionType.DELETE,
            icon: Appicon.delete_red,
            danger: true,
            onClick: (row) => deleteContentFn(row.id),
        }
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