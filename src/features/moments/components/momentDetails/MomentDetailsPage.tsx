import { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useModal } from '@/components/modal';
import { ActionModal } from '@/components/modal/actionModal';
import { Button } from '@/components/button/Button';
import { BUTTON_TYPE } from '@/components/button/constants';
import { AppIcons } from '@/constants/constant';
import { ActionType } from '@/constants/actions';
import { showSuccessToast, showErrorToast, getErrorMessage } from '@/components/common/toastUtils';
import { AxiosError } from 'axios';
import { useMoment, useSuspendMoment, useActivateMoment, useSoftDeleteMoment } from '@/features/moments/hooks/useMoment';
import { MomentOverviewTab } from './pages/momentOverview';
import { MomentPosts } from './pages/momentPosts';
import { MomentMembers } from './pages/momentMembers';
import { MomentReportedContent } from './pages/momentReportedContent';
import { DetailsPageSkeleton } from '@/components/common/DetailsPageSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchX } from 'lucide-react';

type Tab = 'Overview' | 'Posts' | 'Members' | 'Reported Content';

export default function MomentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState<Tab>('Overview');

    const { data: momentData, isLoading, isError, error } = useMoment(id || '');
    const { mutateAsync: suspendMoment } = useSuspendMoment();
    const { mutateAsync: activateMoment } = useActivateMoment();
    const { mutateAsync: softDeleteMoment } = useSoftDeleteMoment();

    const moment = momentData?.payload?.moment;

    const tabs: Tab[] = ['Overview', 'Posts', 'Members', 'Reported Content'];

    /* ------ STATES ------ */
    if (isError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
                <h3 className="font-semibold mb-2">Failed to load moment data</h3>
                <p className="text-sm mb-2">{(error as AxiosError)?.message || 'Unknown error'}</p>
                <p className="text-xs text-red-500">
                    Status: {(error as AxiosError)?.response?.status} — {(error as AxiosError)?.response?.statusText}
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <DetailsPageSkeleton tabCount={4} />;
    }

    if (!moment) {
        return (
            <div className="p-6">
                <EmptyState icon={SearchX} title="No moment data available" description="This moment could not be found." />
            </div>
        );
    }

    const isInactive = moment.is_suspended || moment.status === 'in-active' || moment.is_deleted;

    /* ------ MODALS ------ */
    const suspendTopicFn = () => {
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
                    if (!id) return;
                    try {
                        await suspendMoment(id);
                        showSuccessToast('Topic Suspended', 'The topic has been suspended successfully.');
                        close();
                    } catch (error) {
                        showErrorToast('Suspension Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const activateTopicFn = () => {
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
                    if (!id) return;
                    try {
                        await activateMoment(id);
                        showSuccessToast('Topic Activated', 'The topic has been reactivated successfully.');
                        close();
                    } catch (error) {
                        showErrorToast('Activation Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    const deleteTopicFn = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{ eclipse: AppIcons.eclipseYellow, icon: AppIcons.warningYellow }}
                title="Delete topic"
                description={`Are you sure you want to delete this topic? This action will remove the topic and all its posts. Once deleted, this cannot be recovered.`}
                primaryLabel={ActionType.DELETE_TOPIC}
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {
                    if (!id) return;
                    try {
                        await softDeleteMoment(id);
                        showSuccessToast('Topic Deleted', 'The topic has been deleted successfully.');
                        close();
                        navigate('/moments');
                    } catch (error) {
                        showErrorToast('Deletion Failed', getErrorMessage(error));
                    }
                }}
            />
        ));
    };

    /* ------ RENDER ------ */
    return (
        <div className="flex w-full flex-col">
            {/* HEADER */}
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex text-[#666] text-[13px] font-medium">
                            <NavLink to="/moments">Moments</NavLink>
                            <img src={AppIcons.chevronrightGrey} alt="" />
                            <span className="text-[#FF2860]">{moment.post ?? moment.title ?? 'Topic'}</span>
                        </div>
                        <div className="text-[#0A0D14] text-[19px] font-semibold">
                            Moment Details
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {isInactive ? (
                            <Button
                                leftIcon={AppIcons.usersgroupGreen}
                                variant={BUTTON_TYPE.TETIARY}
                                onClick={activateTopicFn}
                                className="!w-auto !text-[#0A0D14] hover:!bg-gray-50"
                            >
                                {ActionType.ACTIVATE_TOPIC}
                            </Button>
                        ) : (
                            <Button
                                leftIcon={AppIcons.unavailable}
                                variant={BUTTON_TYPE.TETIARY}
                                onClick={suspendTopicFn}
                                className="!w-auto"
                            >
                                {ActionType.SUSPEND_TOPIC}
                            </Button>
                        )}
                        <Button
                            leftIcon={AppIcons.delete_red}
                            variant={BUTTON_TYPE.TETIARY}
                            onClick={deleteTopicFn}
                            className="!w-auto"
                        >
                            {ActionType.DELETE_TOPIC}
                        </Button>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex self-stretch border-b border-t border-[#E8E8E8] bg-white w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative w-48 p-4 text-[13px] font-normal transition-colors cursor-pointer ${isActive ? 'text-[#E31C5F]' : 'text-[#666] hover:text-[#0A0D14]'}`}
                        >
                            {tab}
                            {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E31C5F]" />}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'Overview' && <MomentOverviewTab moment={moment} />}
            {activeTab === 'Posts' && <MomentPosts />}
            {activeTab === 'Members' && <MomentMembers />}
            {activeTab === 'Reported Content' && <MomentReportedContent />}
        </div>
    );
}
