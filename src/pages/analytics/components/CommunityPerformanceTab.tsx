import { MessageMultipleIcon } from "@/components/icons/MessageMultipleIcon";
import { AiContentGeneratorIcon } from "@/components/icons/AiContentGeneratorIcon";
import { UserGroupTeamIcon } from "@/components/icons/UserGroupTeamIcon";
import { ComingSoonCard } from "@/components/charts/ComingSoonCard";

export function CommunityPerformanceTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ComingSoonCard
          icon={MessageMultipleIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Most active communities"
        />
        <div className="flex flex-col gap-4">
          <ComingSoonCard
            icon={MessageMultipleIcon}
            iconBg="#EAF7FF"
            iconColor="#28B0FF"
            title="Community growth rate"
            height={60}
          />
          <ComingSoonCard
            icon={UserGroupTeamIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="Average members per community"
            height={60}
          />
        </div>
        <ComingSoonCard
          icon={MessageMultipleIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Community activity status"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ComingSoonCard
          icon={AiContentGeneratorIcon}
          iconBg="#FCEAFF"
          iconColor="#E228FF"
          title="Posts per community"
        />
        <ComingSoonCard
          icon={MessageMultipleIcon}
          iconBg="#FFF5EA"
          iconColor="#FF9B28"
          title="Engagement per community"
        />
      </div>
    </div>
  );
}
