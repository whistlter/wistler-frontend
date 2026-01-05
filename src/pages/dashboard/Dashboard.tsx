import { AppIcons } from "@/constants/constant";
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
import { useCreateCommunity } from "@/features/communities";
import { toast } from "react-hot-toast";
import { useState } from "react";

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
  const { mutate: createCommunity, isPending: isCreating } = useCreateCommunity();

  const openCreateComunityModal = () => {
    openModal(
      ({ close }) => {
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [category, setCategory] = useState("");
        const [visibility, setVisibility] = useState("Public");
        const [owner, setOwner] = useState("");
        const [image, setImage] = useState<File | null>(null);

        const handleSubmit = () => {
          if (!name.trim()) {
            toast.error("Community name is required");
            return;
          }
          createCommunity({
            community_Name: name,
            description,
            category,
            Visibility: visibility,
            owner,
            image,
          }, {
            onSuccess: () => {
              toast.success("Community created successfully!");
              close();
            },
            onError: (err) => {
              toast.error("Failed to create community");
              console.error(err);
            }
          });
        };

        return (
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
                <FormInput
                  placeholder="Enter name"
                  type={INPUT_TYPES.TEXT}
                  value={name}
                  onChange={setName}
                />
              </div>

              <div>
                <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                  Description
                </label>
                <FormInput
                  placeholder="Enter description"
                  type={INPUT_TYPES.TEXTAREA}
                  value={description}
                  onChange={setDescription}
                />
              </div>

              <div>
                <label className="text-[13px]  font-medium text-gray-700 mb-2">
                  Category
                </label>
                <SelectComponent
                  data={['Technology', 'Business', 'Lifestyle', 'Education']}
                  placeholder="Select"
                  value={category}
                  onChange={(val) => setCategory(val as string)}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">
                  Image
                </label>
                <FileUpload onFileSelect={setImage} />
              </div>

              <div>
                <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <SelectComponent
                  data={['Public', 'Private']}
                  placeholder="Select Visibility"
                  value={visibility}
                  onChange={(val) => setVisibility(val as string)}
                />
              </div>

              <div>
                <label className="block text-[13px]  font-medium text-gray-700 mb-2">
                  Owner Assignment
                </label>
                <p className="text-[13px] text-[#969696] mb-2">
                  Select a user to own and manage this community.
                </p>
                <SelectComponent
                  data={['User 1', 'User 2', 'User 3']}
                  placeholder="Select User"
                  value={owner}
                  onChange={(val) => setOwner(val as string)}
                />
              </div>
            </div>

            {/* FOOTER (FIXED) */}
            <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-6 py-5">
              <div className="flex gap-3">
                <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={isCreating}
                >
                  Create community
                </Button>
              </div>
            </div>
          </div>
        );
      }, { type: 'side', width: 'w-[500px]' })
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