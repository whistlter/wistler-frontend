import { MessageMultipleIcon } from "@/components/icons/MessageMultipleIcon";
import { AiContentGeneratorIcon } from "@/components/icons/AiContentGeneratorIcon";
import { UserGroupTeamIcon } from "@/components/icons/UserGroupTeamIcon";
import { StatCard } from "@/components/charts/StatCard";
import { DonutChartCard } from "@/components/charts/DonutChartCard";
import { RankingListCard } from "@/components/charts/RankingListCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { useCommunityPerformanceAnalytics } from "@/features/analytics";

export function CommunityPerformanceTab() {
  const { data } = useCommunityPerformanceAnalytics();
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RankingListCard
          icon={MessageMultipleIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Most active communities"
          footnote="Top communities by posts, comments, and reactions."
          items={data.mostActiveCommunities}
        />
        <div className="flex flex-col gap-4">
          <StatCard
            icon={MessageMultipleIcon}
            iconBg="#EAF7FF"
            iconColor="#28B0FF"
            title="Community growth rate"
            value={data.communityGrowthRate.value}
            trend={data.communityGrowthRate.trend}
            description={data.communityGrowthRate.description}
          />
          <StatCard
            icon={UserGroupTeamIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="Average members per community"
            value={data.averageMembersPerCommunity.value}
            trend={data.averageMembersPerCommunity.trend}
            description={data.averageMembersPerCommunity.description}
          />
        </div>
        <DonutChartCard
          icon={MessageMultipleIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Community activity status"
          variant="gauge"
          centerValue={data.communityActivityStatus.centerValue}
          segments={data.communityActivityStatus.segments}
          trend={data.communityActivityStatus.trend}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChartCard
          icon={AiContentGeneratorIcon}
          iconBg="#FCEAFF"
          iconColor="#E228FF"
          title="Posts per community"
          footnote="Average number of posts created per community"
          data={data.postsPerCommunity.data}
          activeLabel={data.postsPerCommunity.activeLabel}
        />
        <BarChartCard
          icon={MessageMultipleIcon}
          iconBg="#FFF5EA"
          iconColor="#FF9B28"
          title="Engagement per community"
          footnote="Measures how users interact with content within each community"
          data={data.engagementPerCommunity.data}
          activeLabel={data.engagementPerCommunity.activeLabel}
        />
      </div>
    </div>
  );
}
