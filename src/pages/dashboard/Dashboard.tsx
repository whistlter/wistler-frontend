import { AppIcons } from "@/constants/constant";
import { ModerationOverviewCard } from "./components/ModerationOverviewCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { StatCardsRow } from "./components/StatCardsRow";
import { Button } from "@/components/button/Button";
import { useModal } from "@/components/modal";
import { useCreateCommunity } from "@/features/communities";
import { CommunityForm } from "@/features/communities/components/CommunityForm";
import { showSuccessToast, showErrorToast, getErrorMessage } from "@/components/common/toastUtils";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";
import { useActivities } from "@/features/activities/hooks/useActivities";

export default function DashboardPage() {
  const { openModal, } = useModal();
  const Appicon = { ...AppIcons }
  const { mutate: createCommunity, isPending: isCreating } = useCreateCommunity();

  const { data: overviewData } = useDashboardOverview();
  const { data: activitiesData } = useActivities({ page: 1, pageSize: 5 });

  const overview = overviewData?.payload?.overview;

  const stats = {
    totalUsers: overview?.users?.total_users ?? 0,
    activeUsers: Number(overview?.users?.active_users ?? 0),
    communities: overview?.active_community_count ?? 0,
    suspendedUsers: Number(overview?.users?.banned_users ?? 0),
  };

  const activities = activitiesData?.payload?.activities ?? [];

  const moderation = {
    pendingPosts: 0,
    pendingComments: 0,
    flaggedContent: 0,
    shadowbannedUsers: 0,
  };

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
                showSuccessToast("Community Created", "Community has been successfully created.");
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

  return (
    <div className="space-y-6 p-6">
      {/* HEADER (NO COMPONENT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-[19px] font-semibold text-[#0A0D14]">
            Dashboard
          </h1>
          <p className="text-[13px] font-medium text-[#666]">
            Overview of users, communities, and moderation activity.
          </p>
        </div>
        <div className="lg:grid lg:justify-self-end lg:w-70 sm:50 h-10 my-auto">
          <Button leftIcon={Appicon.plus_cicle} onClick={openCreateComunityModal} className="">
            Create community
          </Button>
        </div>
      </div>

      <StatCardsRow stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard activities={activities} />
        <ModerationOverviewCard moderation={moderation} />
      </div>
    </div>
  );
}