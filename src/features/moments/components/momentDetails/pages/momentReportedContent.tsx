import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModal } from '@/components/modal';
import { ActionModal } from '@/components/modal/actionModal';
import { Table } from '@/components/table/Table';
import type { TableAction, TableColumn } from '@/components/table/types';
import { Pagination } from '@/components/pagination/Pagination';
import { MOMENT_POST_VARIANTE } from '@/components/table/enum/TableEnum';
import { BUTTON_TYPE } from '@/components/button/constants';
import { AppIcons } from '@/constants/constant';
import { ActionType } from '@/constants/actions';
import { useSearchStore } from '@/stores/searchStore';
import { showSuccessToast, showErrorToast, getErrorMessage } from '@/components/common/toastUtils';
import { useMomentPosts, useSoftDeleteMomentPost } from '@/features/moments/hooks/useMomentPost';
import { mapMomentPostToRowDTO, type MomentPostRowDTO } from '@/features/moments/types/momentPost.types';
import { useBlockUser } from '@/features/users/hooks/useUsers';
import { PostContentModal } from '@/features/moments/components/PostContentModal';

export function MomentReportedContent() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openModal } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search reports by user or reason...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    const { data, isLoading, isError, error } = useMomentPosts(id || '', page, PAGE_SIZE, searchTerm, '', '', 'reported');
    const { mutateAsync: softDeletePost } = useSoftDeleteMomentPost();
    const { mutateAsync: blockUser } = useBlockUser();

    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (prevSearchTerm !== searchTerm) {
        setPrevSearchTerm(searchTerm);
        setPage(1);
    }

    const rows: MomentPostRowDTO[] = (data?.payload?.comments ?? []).map(mapMomentPostToRowDTO);
    const totalPages = data?.payload?.meta?.totalPages ?? 1;

    const columns: TableColumn<MomentPostRowDTO>[] = [
        { key: MOMENT_POST_VARIANTE.USER_NAME, header: MOMENT_POST_VARIANTE.USER_NAME_HEADER },
        { key: MOMENT_POST_VARIANTE.POST_CONTENT, header: MOMENT_POST_VARIANTE.POST_CONTENT_HEADER },
        { key: MOMENT_POST_VARIANTE.TOPIC, header: MOMENT_POST_VARIANTE.TOPIC_HEADER },
        { key: MOMENT_POST_VARIANTE.CATEGORY, header: MOMENT_POST_VARIANTE.CATEGORY_HEADER },
        { key: MOMENT_POST_VARIANTE.DATE_POSTED, header: MOMENT_POST_VARIANTE.DATE_POSTED_HEADER },
    ];

    const removePostFn = (postId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseRed, icon: AppIcons.delete_red }}
                title="Remove post"
                description="This action permanently removes this post from the platform."
                primaryLabel={ActionType.REMOVE_POST}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await softDeletePost(postId);
                        showSuccessToast('Post Removed', 'The post has been removed successfully.');
                        close();
                    } catch (error) {
                        showErrorToast('Removal Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const suspendUserFn = (userId: number, userName: string) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseRed, icon: AppIcons.suspendedUserRed }}
                title="Suspend this user"
                description={`Suspending "${userName}" will prevent them from posting or interacting on the platform.`}
                primaryLabel={ActionType.SUSPEND_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await blockUser(userId);
                        showSuccessToast('User Suspended', 'The user has been suspended.');
                        close();
                    } catch (error) {
                        showErrorToast('Suspension Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const actions: TableAction<MomentPostRowDTO>[] = [
        {
            label: ActionType.VIEW_POST,
            icon: AppIcons.eyeOpen,
            onClick: (row) => {
                openModal(({ close }) => (
                    <PostContentModal
                        close={close}
                        image={row.image}
                        post_content={row.post_content}
                        topic={row.topic}
                        category={row.category}
                        date={row.date_posted}
                        user_name={row.user_name}
                        user_image={row.user_image}
                        user_status={row.user_status}
                        flags_count={row.flags_count}
                        reports_count={row.reports_count}
                        reach_count={row.reach_count}
                        participants_count={row.participants_count}
                        likes={Number(row.likes)}
                        comments={Number(row.replies)}
                        onViewProfile={() => { close(); navigate(`/users/Details/${row.user_id}`); }}
                        onRemovePost={() => { close(); removePostFn(row.id); }}
                        onSuspendUser={() => { close(); suspendUserFn(row.user_id, row.user_name); }}
                    />
                ), { type: 'side', width: 'w-[500px]' });
            },
        },
        {
            label: ActionType.REMOVE_POST,
            icon: AppIcons.delete_red,
            danger: true,
            onClick: (row) => removePostFn(row.id),
        },
    ];

    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as Error)?.message ?? 'Failed to load reports'}
            </div>
        );
    }

    return (
        <div className="px-6">
            <div className="py-6">
                <Table data={rows} columns={columns} actions={actions} loading={isLoading} />
            </div>
            <div className="mt-6">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}
