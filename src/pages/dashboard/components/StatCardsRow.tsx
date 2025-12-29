import { AppIcons } from "@/constant/constant";
import { formatNumber } from "@/utils/helper";

type Props = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    communities: number;
    suspendedUsers: number;
  };
};

export function StatCardsRow({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { eclipse: AppIcons.eclipseRed, icon: AppIcons.usersRed, label: "Total Users", value: stats.totalUsers, desc: "Total registered users" },
        { eclipse: AppIcons.eclipseGreen, icon: AppIcons.usersgroupGreen, label: "Active Users", value: stats.activeUsers, desc: "Users logged in within the last week" },
        { eclipse: AppIcons.eclipseBlue, icon: AppIcons.messageMultipleBlue, label: "Communities", value: stats.communities, desc: "Number of active communities" },
        { eclipse: AppIcons.eclipseGrey, icon: AppIcons.userBlocked, label: "Suspended/Banned Users", value: stats.suspendedUsers, desc: "Suspended or banned users" },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-[#E8E8E8] bg-white  shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >

          <div className="flex gap-2 border-b border-[#EFEFF3] p-4">
            <div className="relative flex items-center justify-center">
              <img src={item.eclipse} alt="" className="relative w-full " />
              <img src={item.icon} alt="" className="absolute w-5" />
            </div>
            <p className="text-[14px] font-medium text-[#0A0D14]">
              {item.label}
            </p>
          </div>
          <p className="mt-2 text-[19px] font-semibold text-[#0A0D14] px-4">
            {formatNumber(item.value)}
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#969696] px-4 pb-4">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}