import { useParams } from 'react-router-dom';
import { AppIcons } from '@/constants/constant';
import type { MomentApi } from '@/features/moments/types/moment.types';
import { useMomentStat } from '@/features/moments/hooks/useMoment';

type MomentOverviewTabProps = {
    moment: MomentApi;
};

export function MomentOverviewTab({ moment }: MomentOverviewTabProps) {
    const { id } = useParams<{ id: string }>();
    const { data: statData } = useMomentStat(id || '');

    const isInactive = moment.is_suspended || moment.status === 'in-active' || moment.is_deleted;
    const topicName = moment.post ?? moment.title ?? 'N/A';

    const statsCards = [
        {
            eclipse: AppIcons.eclipseRed,
            icon: AppIcons.usersRed,
            label: 'Members',
            value: (statData?.payload?.momentUsersCount ?? moment.memberCount ?? moment.members_count ?? 0).toLocaleString(),
            subLabel: 'Total moment members',
        },
        {
            eclipse: AppIcons.eclipseBlue,
            icon: AppIcons.messageMultipleBlue,
            label: 'Total Posts',
            value: (statData?.payload?.momentCommentsCount ?? moment.comments_count ?? moment.posts_count ?? 0).toLocaleString(),
            subLabel: 'Total posts in this topic',
        },
        {
            eclipse: AppIcons.eclipseYellow,
            icon: AppIcons.warningYellow,
            label: 'Flagged Content',
            value: (statData?.payload?.momentCommentsFlaggedCount ?? moment.reports_count ?? 0).toLocaleString(),
            subLabel: 'Total reported content',
        },
    ];

    return (
        <div className="flex flex-col gap-4 pt-6">
            <section className="flex flex-col gap-6 p-6">
                {/* Avatar + name + status */}
                <div className="flex gap-4 items-center">
                    <img
                        src={moment.image || `https://i.pravatar.cc/100?img=${moment.id || 12}`}
                        alt="Moment"
                        className="h-20 w-20 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-[19px] font-semibold text-[#0A0D14]">
                                {topicName}
                            </h1>
                            <span className="flex items-center gap-2 rounded-[8px] border border-[#E8E8E8] px-3 py-1 text-[13px] font-medium text-[#667085]">
                                <span className={`h-2 w-2 rounded-[2px] ${!isInactive ? 'bg-[#12B76A]' : 'bg-[#667085]'}`} />
                                {isInactive ? 'in-active' : 'Active'}
                            </span>
                        </div>
                        <p className="max-w-[720px] text-[14px] leading-[22px] text-[#667085]">
                            {moment.description || 'No description available'}
                        </p>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-3 text-[13px] text-[#667085]">
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.dashboard} alt="" />
                        <span>Category:</span>
                        <span className="font-medium text-[#344054]">
                            {moment.interest?.title ?? moment.category ?? 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.user} alt="" />
                        <span>Created by:</span>
                        <span className="font-medium text-[#344054]">
                            {moment.user
                                ? `${moment.user.first_name ?? ''} ${moment.user.last_name ?? ''}`.trim() || moment.user.username
                                : 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={AppIcons.calendar} alt="" />
                        <span>Created:</span>
                        <span className="font-medium text-[#344054]">
                            {moment.createdAt ? new Date(moment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                    </div>
                </div>
            </section>

            <h2 className="text-[14px] font-normal text-[#0A0D14] border-b border-t border-[#E8E8E8] w-full py-4">
                <div className="pl-6">Stats Overview</div>
            </h2>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-6 pb-6">
                {statsCards.map((card) => (
                    <div key={card.label} className="flex flex-col gap-3 rounded-xl border border-[#E8E8E8] bg-white">
                        <div className="flex items-center gap-2 border-b border-[#E8E8E8] w-full p-4">
                            <div className="relative flex items-center justify-center">
                                <img src={card.eclipse} alt="" className="relative w-full" />
                                <img src={card.icon} alt="" className="absolute w-5" />
                            </div>
                            <span className="text-[13px] font-normal text-[#666]">{card.label}</span>
                        </div>
                        <div className="grid grid-cols-1">
                            <span className="text-[20px] font-normal text-[#0A0D14] leading-none p-4">
                                {card.value}
                            </span>
                            <span className="text-[13px] leading-[22px] text-[#969696] pl-4 pb-6">
                                {card.subLabel}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
