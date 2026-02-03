import { AppIcons } from "@/constants/constant";
import { ModerationOverviewCard } from "./components/ModerationOverviewCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { StatCardsRow } from "./components/StatCardsRow";
import { Button } from "@/components/button/Button";
import { useModal } from "@/components/modal";
import { useCreateCommunity } from "@/features/communities";
import { CommunityForm } from "@/features/communities/components/CommunityForm";
import { showSuccessToast, showErrorToast } from "@/components/common/toastUtils";

export default function DashboardPage() {
  const { openModal, } = useModal();
  const Appicon = { ...AppIcons }
  const { mutate: createCommunity, isPending: isCreating } = useCreateCommunity();

  const stats = {
    totalUsers: 344,
    activeUsers: 344,
    communities: 39944,
    suspendedUsers: 344,
  };

  const activities = [
    {
      id: 1,
      title: "Adelekan Samuel joined Young Shall Grow community",
      date: "2nd December, 2025",
      eclipse: AppIcons.eclipseRed,
      icon: AppIcons.activityRed
    },
    {
      id: 2,
      title: "Micheal Soludo submitted a post for review",
      date: "2nd December, 2025",
      eclipse: AppIcons.eclipseRed,
      icon: AppIcons.flagRed
    },
  ];

  const moderation = {
    pendingPosts: 344,
    pendingComments: 349874,
    flaggedContent: 344,
    shadowbannedUsers: 344,
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
                showErrorToast("Creation Failed", "Failed to create community.");
                console.error(err);
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