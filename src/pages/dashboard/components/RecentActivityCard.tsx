import { AppIcons } from "@/constants/constant";
import { useNavigate } from "react-router-dom";
import type { ActivityItem } from "@/features/activities/hooks/useActivities";

function getActivityIcon(type: string, subType: string): string {
  switch (subType) {
    case 'community-created':         return AppIcons.users;
    case 'community-joined':          return AppIcons.usergroup;
    case 'community-request-to-join': return AppIcons.usersRed;
    case 'community-updated':         return AppIcons.eclipseGreen;
    case 'community-suspended':       return AppIcons.unavailable;
    case 'post-reported':             return AppIcons.flagRed;
    case 'moment-created':            return AppIcons.lightning;
    case 'moment-reported':           return AppIcons.flagblue;
  }
  switch (type) {
    case 'reply':      return AppIcons.messageBubble;
    case 'comment':    return AppIcons.messageMultiple;
    case 'post':       return AppIcons.clipboard;
    case 'moment':     return AppIcons.lightning;
    case 'events':     return AppIcons.calendar;
    case 'connection': return AppIcons.userBlocked;
    case 'community':  return AppIcons.users;
    case 'user':       return AppIcons.user;
    default:           return AppIcons.activityRed;
  }
}

export function RecentActivityCard({ activities }: { activities: ActivityItem[] }) {
  const navigate = useNavigate();
  const appicon = AppIcons;

  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#EFEFF3] p-4 flex gap-2 items-center">
        <div className="relative flex items-center justify-center">
          <img src={appicon.eclipseRed} alt="" className="relative w-10" />
          <img src={appicon.activityRed} alt="" className="absolute w-5" />
        </div>
        <p className="text-[14px] font-medium text-[#0A0D14]">Recent Activity</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activities.map((item) => (
          <div key={item.id} className="flex justify-between p-4 last:border-b-0">
            <div className="flex flex-col gap-1 min-w-0 pr-4">
              <div className="text-[13px] font-medium text-[#1A1A1A] flex gap-2 items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-sm flex-shrink-0">
                  <img src={getActivityIcon(item.type, item.sub_type)} alt="" className="w-4 h-4" />
                </div>
                <span className="truncate">{item.title}</span>
              </div>
              <p className="text-[13px] font-medium text-[#969696]">
                {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <button
              onClick={() => navigate(`/activity-logs/Details/${item.id}`, { state: { activity: item } })}
              className="text-[13px] font-medium text-[#ff3b6b] cursor-pointer shrink-0 self-center"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[#EFEFF3] p-4 flex justify-center">
        <button
          className="text-[13px] font-medium text-[#ff3b6b] cursor-pointer"
          onClick={() => navigate('/activity-logs')}
        >
          View full activity log
        </button>
      </div>
    </div>
  );
}
