import { AppIcons } from "@/constant/constant";
import { ModerationOverviewCard } from "./components/ModerationOverviewCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { StatCardsRow } from "./components/StatCardsRow";
import { Button } from "@/components/button/Button";
import { SelectComponent } from "@/components/select/selectComponent";
import { BUTTON_TYPE } from "@/components/button/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { useModal } from "@/components/modal";
import FileUpload from "@/components/fileUpload/upload";

export default function DashboardPage() {
  const { openModal, } = useModal();
  const Appicon = { ...AppIcons }
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
              <label className="block text-[13px] font-medium text-gray-700 mb-2">
                Community Name
              </label>
              <FormInput placeholder="Enter name" type={INPUT_TYPES.TEXT} />
            </div>

            <div>
              <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                Description
              </label>
              <FormInput placeholder="Enter description" type={INPUT_TYPES.TEXTAREA} />
            </div>

            <div>
              <label className="text-[13px]  font-medium text-gray-700 mb-2">
                Category
              </label>
              <SelectComponent data={['option1', 'option2']} placeholder="Select" />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">
                Image
              </label>
              <FileUpload />
            </div>

            <div>
              <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <SelectComponent data={['option1', 'option2']} placeholder="Select Visibility" />
            </div>

            <div>
              <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                Owner Assignment
              </label>
              <p className="text-[13px] text-[#969696] mb-2">
                Select a user to own and manage this community.
              </p>
              <SelectComponent data={['option1', 'option2']} placeholder="Select User" />
            </div>
            <div>
              <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                Add Moderators
              </label>
              <p className="text-[13px] text-[#969696] mb-2">
                Choose one or more Moderators
              </p>
              <SelectComponent data={['option1', 'option2']} placeholder="Select Moderator" />
            </div>
          </div>

          {/* FOOTER (FIXED) */}
          <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-6 py-5">
            <div className="flex gap-3">
              <Button onClick={close} type={BUTTON_TYPE.SECONDARY}>
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