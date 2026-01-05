import { AppIcons } from "@/constants/constant";

type Activity = {
  id: number;
  title: string;
  date: string;
};

export function RecentActivityCard({
  activities,
}: {
  activities: Activity[];
}) {
  const appicon = AppIcons;
  const getActivityIcon = (action: string) => {
    if (action.toLowerCase().includes("Adelekan")) return AppIcons.calendar;
    if (action.toLowerCase().includes("review")) return AppIcons.suspendedUserRed;
    if (action.toLowerCase().includes("community")) return AppIcons.unavailable;
    if (action.toLowerCase().includes("community")) return AppIcons.unavailable;
    return "•";
  };
  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#EFEFF3] p-4 flex gap-2 items-center">
        <div className="relative flex items-center justify-center">
          <img src={appicon.eclipseRed} alt="" className="relative w-10 " />
          <img src={appicon.activityRed} alt="" className="absolute w-5" />
        </div>
        <p className="text-[14px] font-medium text-[#0A0D14]">
          Recent Activity
        </p>
      </div>

      {/* Content (grows to fill space) */}
      <div className="flex-1 overflow-y-auto">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex justify-between p-4  last:border-b-0"
          >
            <div className="flex flex-col gap-1">

              <div className="text-[13px] font-medium text-[#1A1A1A] flex gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-sm flex-shrink-0">
                  <img src={getActivityIcon(item.title)} alt="" />
                </div>
                {item.title}
              </div>
              <p className="text-[13px] font-medium text-[#969696]">
                {item.date}
              </p>
            </div>

            <button className="text-[13px] font-medium text-[#ff3b6b] cursor-pointer">
              View
            </button>
          </div>
        ))}
      </div>

      {/* Footer (always at bottom) */}
      <div className="border-t border-[#EFEFF3] p-4 flex justify-center">
        <button className="text-[13px] font-medium text-[#ff3b6b] cursor-pointer">
          View full activity log
        </button>
      </div>
    </div>
  );
}