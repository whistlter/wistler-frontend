import { AppIcons } from "@/constant/constant";

type Props = {
  moderation: {
    pendingPosts: number;
    pendingComments: number;
    flaggedContent: number;
    shadowbannedUsers: number;
  };
};

export function ModerationOverviewCard({ moderation }: Props) {
  const appicon = AppIcons;

  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white">
      <div className="border-b border-[#EFEFF3] p-4 flex gap-2 items-center">
        <div className="relative flex items-center justify-center">
          <img src={appicon.eclipseRed} alt="" className="relative w-10 " />
          <img src={appicon.flagRed} alt="" className="absolute w-5" />
        </div>
        <p className="text-[14px] font-medium text-[#0A0D14]">
          Moderation Overview
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {[
          { eclipse: AppIcons.eclipseLightBlue, icon: AppIcons.clipboard, label: "Pending Posts", value: moderation.pendingPosts },
          { eclipse: AppIcons.eclipseBlue, icon: AppIcons.messageBubble, label: "Pending Comments", value: moderation.pendingComments },
          { eclipse: AppIcons.eclipseBlue, icon: AppIcons.flagblue, label: "Flagged Content", value: moderation.flaggedContent },
          { eclipse: AppIcons.eclipseBlue, icon: AppIcons.userBlockedblue, label: "Shadowbanned Users", value: moderation.shadowbannedUsers },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-[#F7F9FC] p-4"
          >
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center justify-center">
                <img src={item.eclipse} alt="" className="relative w-9 " />
                <img src={item.icon} alt="" className="absolute w-4" />
              </div>
              <p className="text-[13px] font-medium text-[#666]">
                {item.label}
              </p>
            </div>
            <p className="mt-2 text-[19px] font-semibold text-[#0A0D14]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#EFEFF3] p-4 text-center">
        <button className="text-[13px] font-medium text-[#ff3b6b] cursor-pointer">
          Go to Moderation Queue
        </button>
      </div>
    </div>
  );
}