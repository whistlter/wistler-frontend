import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/components/modal';
import { ActionModal, DateRangeModal } from '@/components/modal';
import { Table } from '@/components/table/Table';
import type { TableAction, TableColumn } from '@/components/table/types';
import { Pagination } from '@/components/pagination/Pagination';
import { FilterDropdown } from '@/components/filter/FilterDropdown';
import type { FilterOption } from '@/components/filter/types';
import { BUTTON_TYPE } from '@/components/button/constants';
import { AppIcons } from '@/constants/constant';
import { ActionType } from '@/constants/actions';
import { useSearchStore } from '@/stores/searchStore';
import { showSuccessToast, showErrorToast, getErrorMessage } from '@/components/common/toastUtils';
import {
    MOMENT_TOPIC_VARIANTE,
    MOMENT_POST_VARIANTE,
} from '@/components/table/enum/TableEnum';
import {
    useMoments,
    useSoftDeleteMoment,
    useSuspendMoment,
    useActivateMoment,
    useAllMomentPosts,
    useSoftDeleteMomentPost,
    useMomentStats,
    mapMomentToRowDTO,
    mapMomentPostToRowDTO,
    type MomentRowDTO,
    type MomentPostRowDTO,
} from '@/features/moments';
import { formatNumber } from '@/utils/helper';
import { useBlockUser } from '@/features/users/hooks/useUsers';
import { PostContentModal } from '@/features/moments/components/PostContentModal';

type Tab = 'Topics' | 'Posts' | 'Reports';

export default function Moments() {
    const navigate = useNavigate();
    const { openModal } = useModal();
    const { searchTerm, setPlaceholder, clearSearch } = useSearchStore();
    const [activeTab, setActiveTab] = useState<Tab>('Topics');

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const placeholders: Record<Tab, string> = {
            Topics: 'Search topics by name or category...',
            Posts: 'Search posts by content or user...',
            Reports: 'Search reports by user or reason...',
        };
        setPlaceholder(placeholders[activeTab]);
        return () => clearSearch();
    }, [activeTab, setPlaceholder, clearSearch]);

    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (prevSearchTerm !== searchTerm) {
        setPrevSearchTerm(searchTerm);
        setPage(1);
    }

    /* ------ DATA HOOKS ------ */
    const statsData = useMomentStats();
    const topicsData = useMoments(page, PAGE_SIZE, searchTerm, startDate, endDate, statusFilter);
    const postsData = useAllMomentPosts(page, PAGE_SIZE, searchTerm, startDate, endDate, statusFilter);
    const reportedTopicsData = useMoments(page, PAGE_SIZE, searchTerm, startDate, endDate, 'reported');
    const { mutateAsync: softDeleteMoment } = useSoftDeleteMoment();
    const { mutateAsync: suspendMoment } = useSuspendMoment();
    const { mutateAsync: activateMoment } = useActivateMoment();
    const { mutateAsync: softDeletePost } = useSoftDeleteMomentPost();
    const { mutateAsync: blockUser } = useBlockUser();

    /* ------ ROWS ------ */
    const topicRows: MomentRowDTO[] = (topicsData.data?.payload?.moments ?? []).map(mapMomentToRowDTO);
    const postRows: MomentPostRowDTO[] = (postsData.data?.payload?.comments ?? []).map(mapMomentPostToRowDTO);
    const reportRows: MomentRowDTO[] = (reportedTopicsData.data?.payload?.moments ?? []).map(mapMomentToRowDTO);

    const topicTotalPages = topicsData.data?.payload?.meta?.totalPages ?? 1;
    const postTotalPages = postsData.data?.payload?.meta?.totalPages ?? 1;
    const reportTotalPages = reportedTopicsData.data?.payload?.meta?.totalPages ?? 1;

    /* ------ TOPIC ACTIONS ------ */
    const deleteTopic = (topicId: number, topicName: string) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseYellow, icon: AppIcons.warningYellow }}
                title="Delete this topic?"
                description={`This action will permanently remove the topic "${topicName}" and all its posts within it. This action is irreversible.`}
                primaryLabel={ActionType.DELETE_TOPIC}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {
                    try {
                        await softDeleteMoment(topicId);
                        showSuccessToast('Topic Deleted', 'The topic has been deleted successfully.');
                        close();
                    } catch (error) {
                        showErrorToast('Deletion Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const suspendTopic = (topicId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseRed, icon: AppIcons.suspendedUserRed }}
                title="Suspend this topic"
                description="Members will no longer be able to post or interact until it is reactivated."
                primaryLabel={ActionType.SUSPEND_TOPIC}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await suspendMoment(topicId);
                        showSuccessToast('Topic Suspended', 'The topic has been suspended.');
                        close();
                    } catch (error) {
                        showErrorToast('Suspension Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const activateTopic = (topicId: number) => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseGreen, icon: AppIcons.usersgroupGreen }}
                title="Activate this topic"
                description="Members will be able to post and interact again."
                primaryLabel={ActionType.ACTIVATE_TOPIC}
                primaryIntent="default"
                showLoader
                buttonVariant={BUTTON_TYPE.TETIARY}
                onPrimaryAction={async () => {
                    try {
                        await activateMoment(topicId);
                        showSuccessToast('Topic Activated', 'The topic has been reactivated.');
                        close();
                    } catch (error) {
                        showErrorToast('Activation Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    /* ------ POST ACTIONS ------ */
    const viewPostFn = (row: MomentPostRowDTO) => {
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
                onSuspendUser={() => { close(); suspendReportedUserFn(row.user_id, row.user_name); }}
            />
        ), { type: 'side', width: 'w-[500px]' });
    };

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

    const suspendReportedUserFn = (userId: number, userName: string) => {
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

    /* ------ COLUMNS ------ */
    const topicColumns: TableColumn<MomentRowDTO>[] = [
        { key: MOMENT_TOPIC_VARIANTE.TOPIC_NAME, header: MOMENT_TOPIC_VARIANTE.TOPIC_NAME_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.CATEGORY, header: MOMENT_TOPIC_VARIANTE.CATEGORY_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.MEMBERS, header: MOMENT_TOPIC_VARIANTE.MEMBERS_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.POSTS, header: MOMENT_TOPIC_VARIANTE.POSTS_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.CREATED_BY, header: MOMENT_TOPIC_VARIANTE.CREATED_BY_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.CREATED_DATE, header: MOMENT_TOPIC_VARIANTE.CREATED_DATE_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.STATUS, header: MOMENT_TOPIC_VARIANTE.STATUS_HEADER },
    ];

    const postColumns: TableColumn<MomentPostRowDTO>[] = [
        { key: MOMENT_POST_VARIANTE.USER_NAME, header: MOMENT_POST_VARIANTE.USER_NAME_HEADER },
        { key: MOMENT_POST_VARIANTE.POST_CONTENT, header: MOMENT_POST_VARIANTE.POST_CONTENT_HEADER },
        { key: MOMENT_POST_VARIANTE.TOPIC, header: MOMENT_POST_VARIANTE.TOPIC_HEADER },
        { key: MOMENT_POST_VARIANTE.CATEGORY, header: MOMENT_POST_VARIANTE.CATEGORY_HEADER },
        { key: MOMENT_POST_VARIANTE.LIKES, header: MOMENT_POST_VARIANTE.LIKES_HEADER },
        { key: MOMENT_POST_VARIANTE.REPLIES, header: MOMENT_POST_VARIANTE.REPLIES_HEADER },
        { key: MOMENT_POST_VARIANTE.DATE_POSTED, header: MOMENT_POST_VARIANTE.DATE_POSTED_HEADER },
    ];

    const reportColumns: TableColumn<MomentRowDTO>[] = [
        { key: MOMENT_TOPIC_VARIANTE.TOPIC_NAME, header: MOMENT_TOPIC_VARIANTE.TOPIC_NAME_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.CATEGORY, header: MOMENT_TOPIC_VARIANTE.CATEGORY_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.MEMBERS, header: MOMENT_TOPIC_VARIANTE.MEMBERS_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.POSTS, header: MOMENT_TOPIC_VARIANTE.POSTS_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.CREATED_BY, header: MOMENT_TOPIC_VARIANTE.CREATED_BY_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.CREATED_DATE, header: MOMENT_TOPIC_VARIANTE.CREATED_DATE_HEADER },
        { key: MOMENT_TOPIC_VARIANTE.STATUS, header: MOMENT_TOPIC_VARIANTE.STATUS_HEADER },
    ];

    /* ------ ACTIONS ------ */
    const topicActions: TableAction<MomentRowDTO>[] = [
        {
            label: ActionType.VIEW,
            icon: AppIcons.eyeOpen,
            onClick: (row) => navigate(`/moments/Details/${row.id}`),
        },
        {
            label: ActionType.SUSPEND_TOPIC,
            icon: AppIcons.unavailable,
            danger: true,
            onClick: (row) => {
                if (row.status === 'in-active') {
                    activateTopic(row.id);
                } else {
                    suspendTopic(row.id);
                }
            },
            getLabel: (row: MomentRowDTO) =>
                row.status === 'in-active' ? ActionType.ACTIVATE_TOPIC : ActionType.SUSPEND_TOPIC,
            getIcon: (row: MomentRowDTO) =>
                row.status === 'in-active' ? AppIcons.usersgroupGreen : AppIcons.unavailable,
            getDanger: (row: MomentRowDTO) => row.status !== 'in-active',
        },
        {
            label: ActionType.DELETE_TOPIC,
            icon: AppIcons.delete_red,
            danger: true,
            onClick: (row) => deleteTopic(row.id, row.topic_name),
        },
    ];

    const postActions: TableAction<MomentPostRowDTO>[] = [
        {
            label: ActionType.VIEW_POST,
            icon: AppIcons.eyeOpen,
            onClick: (row) => viewPostFn(row),
        },
        {
            label: ActionType.REMOVE_POST,
            icon: AppIcons.delete_red,
            danger: true,
            onClick: (row) => removePostFn(row.id),
        },
    ];

    const reportActions: TableAction<MomentRowDTO>[] = [
        {
            label: ActionType.VIEW,
            icon: AppIcons.eyeOpen,
            onClick: (row) => navigate(`/moments/Details/${row.id}`),
        },
        {
            label: ActionType.DELETE_TOPIC,
            icon: AppIcons.delete_red,
            danger: true,
            onClick: (row) => deleteTopic(row.id, row.topic_name),
        },
    ];

    /* ------ FILTER ------ */
    const filterOptions: FilterOption[] = [
        {
            label: 'Status',
            value: 'status',
            icon: AppIcons.lightning,
            subOptions: [
                { label: 'Active', value: 'active', isSelected: statusFilter === 'active' },
                { label: 'Inactive', value: 'in-active', isSelected: statusFilter === 'in-active' },
            ],
        },
        { label: 'Date', value: 'date', icon: AppIcons.calendar },
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

    const handleSubOptionSelect = (_parent: FilterOption, sub: { value: string }) => {
        setStatusFilter(sub.value);
        setPage(1);
    };

    const tabs: Tab[] = ['Topics', 'Posts', 'Reports'];

    /* ------ RENDER ------ */
    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex flex-col items-start gap-1 pb-6">
                <div className="text-[#0A0D14] text-[19px] font-semibold">Moments</div>
                <div className="text-[#666] text-[13px] font-medium">
                    Monitor active Moment topics, moderate conversations, and manage communities across categories.
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { eclipse: AppIcons.eclipseLightBlue, icon: AppIcons.lightning, label: 'Active Topics', value: statsData.data?.payload.momentsCount ?? 0, desc: 'Total Moment topics for posts.' },
                    { eclipse: AppIcons.eclipseBlue, icon: AppIcons.usersgroupGreen, label: 'Active Participants', value: statsData.data?.payload.momentUsersCount ?? 0, desc: 'Total user count across all Moments' },
                    { eclipse: AppIcons.eclipseGrey, icon: AppIcons.messageMultipleBlue, label: 'Total Posts', value: statsData.data?.payload.momentCommentsCount ?? 0, desc: 'Total posts shared in topics' },
                    { eclipse: AppIcons.eclipseRed, icon: AppIcons.flagRed, label: 'Flagged Content', value: statsData.data?.payload.momentFlagged ?? 0, desc: 'Posts or comments reported' },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#E8E8E8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <div className="flex gap-2 border-b border-[#EFEFF3] p-4">
                            <div className="relative flex items-center justify-center">
                                <img src={item.eclipse} alt="" className="relative w-full" />
                                <img src={item.icon} alt="" className="absolute w-5" />
                            </div>
                            <p className="text-[14px] font-medium text-[#0A0D14]">{item.label}</p>
                        </div>
                        <p className="mt-2 text-[19px] font-semibold text-[#0A0D14] px-4">{formatNumber(item.value)}</p>
                        <p className="mt-1 text-[13px] font-medium text-[#969696] px-4 pb-4">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* TABS */}
            <div className="flex border-b border-t border-[#E8E8E8] bg-white w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                            className={`relative w-40 p-4 text-[13px] font-normal transition-colors cursor-pointer ${isActive ? 'text-[#E31C5F]' : 'text-[#666] hover:text-[#0A0D14]'}`}
                        >
                            {tab}
                            {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E31C5F]" />}
                        </button>
                    );
                })}
            </div>

            {/* TOPICS TAB */}
            {activeTab === 'Topics' && (
                <>
                    <div className="flex items-center py-4">
                        <p className="text-[13px] text-[#666] font-medium">View and manage all active Moment topics across categories.</p>
                    </div>
                    <Table
                        data={topicRows}
                        columns={topicColumns}
                        actions={topicActions}
                        loading={topicsData.isLoading}
                    />
                    <div className="mt-6">
                        <Pagination currentPage={page} totalPages={topicTotalPages} onPageChange={setPage} />
                    </div>
                </>
            )}

            {/* POSTS TAB */}
            {activeTab === 'Posts' && (
                <>
                    <div className="flex items-center justify-between py-4">
                        <p className="text-[13px] text-[#666] font-medium">Oversee and manage posts on Moment topics</p>
                        <div className="flex items-center gap-3">
                            {(startDate || endDate) && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#FCE7F3] border border-[#FCE7F3] rounded-lg">
                                    <span className="text-sm font-medium text-[#BE185D]">{startDate} – {endDate}</span>
                                    <button onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }} className="text-[#BE185D] hover:text-[#9F1239] cursor-pointer">
                                        <img src={AppIcons.x} alt="Clear" className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <FilterDropdown
                                options={[{ label: 'Date', value: 'date', icon: AppIcons.calendar }]}
                                onSelect={handleFilterSelect}
                                onSubOptionSelect={handleSubOptionSelect}
                            />
                        </div>
                    </div>
                    <Table
                        data={postRows.map(row => ({ ...row, status: 'active' }))}
                        columns={postColumns}
                        actions={postActions}
                        loading={postsData.isLoading}
                    />
                    <div className="mt-6">
                        <Pagination currentPage={page} totalPages={postTotalPages} onPageChange={setPage} />
                    </div>
                </>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'Reports' && (
                <>
                    <div className="flex items-center justify-between py-4">
                        <p className="text-[13px] text-[#666] font-medium">Review posts and users reported by the users</p>
                        <div className="flex items-center gap-3">
                            {statusFilter !== 'all' && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#FCE7F3] border border-[#FCE7F3] rounded-lg">
                                    <span className="text-sm font-medium text-[#BE185D] capitalize">{statusFilter}</span>
                                    <button onClick={() => { setStatusFilter('all'); setPage(1); }} className="text-[#BE185D] hover:text-[#9F1239] cursor-pointer">
                                        <img src={AppIcons.x} alt="Clear" className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {(startDate || endDate) && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#FCE7F3] border border-[#FCE7F3] rounded-lg">
                                    <span className="text-sm font-medium text-[#BE185D]">{startDate} – {endDate}</span>
                                    <button onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }} className="text-[#BE185D] hover:text-[#9F1239] cursor-pointer">
                                        <img src={AppIcons.x} alt="Clear" className="w-4 h-4" />
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
                    <Table
                        data={reportRows}
                        columns={reportColumns}
                        actions={reportActions}
                        loading={reportedTopicsData.isLoading}
                    />
                    <div className="mt-6">
                        <Pagination currentPage={page} totalPages={reportTotalPages} onPageChange={setPage} />
                    </div>
                </>
            )}
        </div>
    );
}
