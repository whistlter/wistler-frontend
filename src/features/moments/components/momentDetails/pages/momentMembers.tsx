import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useModal } from '@/components/modal';
import { ActionModal } from '@/components/modal/actionModal';
import { Table } from '@/components/table/Table';
import type { TableAction, TableColumn } from '@/components/table/types';
import { Pagination } from '@/components/pagination/Pagination';
import { MOMENT_MEMBER_VARIANTE } from '@/components/table/enum/TableEnum';
import { BUTTON_TYPE } from '@/components/button/constants';
import { AppIcons } from '@/constants/constant';
import { ActionType } from '@/constants/actions';
import { useSearchStore } from '@/stores/searchStore';
import { showSuccessToast, showErrorToast, getErrorMessage } from '@/components/common/toastUtils';
import { useMomentMembers, useRemoveUserFromMoment } from '@/features/moments/hooks/useMomentMember';
import { mapMomentMemberToRowDTO, type MomentMemberRowDTO } from '@/features/moments/types/momentMember.types';

export function MomentMembers() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openModal } = useModal();
    const queryClient = useQueryClient();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();

    useEffect(() => {
        setPlaceholder('Search members by name...');
        return () => clearSearch();
    }, [setPlaceholder, clearSearch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    const { data, isLoading, isError, error } = useMomentMembers(id || '', page, PAGE_SIZE, searchTerm);
    const { mutateAsync: removeUser } = useRemoveUserFromMoment();

    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (prevSearchTerm !== searchTerm) {
        setPrevSearchTerm(searchTerm);
        setPage(1);
    }

    const members = data?.payload?.members ?? [];
    const rows: MomentMemberRowDTO[] = members.map(mapMomentMemberToRowDTO);
    const totalPages = data?.payload?.meta
        ? Math.ceil((data.payload.meta.total ?? 0) / PAGE_SIZE)
        : 1;

    const columns: TableColumn<MomentMemberRowDTO>[] = [
        { key: MOMENT_MEMBER_VARIANTE.NAME, header: MOMENT_MEMBER_VARIANTE.NAME_HEADER },
        { key: MOMENT_MEMBER_VARIANTE.JOIN_DATE, header: MOMENT_MEMBER_VARIANTE.JOIN_DATE_HEADER },
        { key: MOMENT_MEMBER_VARIANTE.POSTS, header: MOMENT_MEMBER_VARIANTE.POSTS_HEADER },
        { key: MOMENT_MEMBER_VARIANTE.REPORTS, header: MOMENT_MEMBER_VARIANTE.REPORTS_HEADER },
    ];

    const removeUserFn = (row: MomentMemberRowDTO) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseYellow, icon: AppIcons.warningYellow }}
                title="Remove user from topic"
                description={`Are you sure you want to remove ${row.name} from this topic? They will lose access to all topic content.`}
                primaryLabel={ActionType.REMOVE_USER}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    if (!id) return;
                    try {
                        await removeUser({ momentId: id, userId: row.id });
                        showSuccessToast('User Removed', `${row.name} has been removed from the topic.`);
                        queryClient.invalidateQueries({ queryKey: ['moments', id, 'members'] });
                        close();
                    } catch (error) {
                        showErrorToast('Removal Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const actions: TableAction<MomentMemberRowDTO>[] = [
        {
            label: ActionType.VIEW_PROFILE,
            icon: AppIcons.eyeOpen,
            onClick: (row) => navigate(`/users/Details/${row.id}`),
        },
        {
            label: ActionType.REMOVE_USER,
            icon: AppIcons.unavailable,
            danger: true,
            onClick: (row) => removeUserFn(row),
        },
    ];

    if (isError) {
        return (
            <div className="rounded-lg border p-4 text-red-600">
                {(error as Error)?.message ?? 'Failed to load members'}
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
