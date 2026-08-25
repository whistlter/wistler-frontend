import { UserGroupIcon } from "@/components/icons/UserGroupIcon";
import { MessageMultipleIcon } from "@/components/icons/MessageMultipleIcon";
import { AiContentGeneratorIcon } from "@/components/icons/AiContentGeneratorIcon";
import { ActivityIcon } from "@/components/icons/ActivityIcon";
import { ThumbsUpIcon } from "@/components/icons/ThumbsUpIcon";
import { StatCard } from "@/components/charts/StatCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { DonutChartCard } from "@/components/charts/DonutChartCard";
import { AnalyticsCardSkeleton } from "@/components/charts/AnalyticsCardSkeleton";
import { useOverviewAnalytics } from "@/features/analytics";

type Props = {
  startDate?: string;
  endDate?: string;
};

export function OverviewTab({ startDate, endDate }: Props) {
  const { data, isLoading } = useOverviewAnalytics(startDate, endDate);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={UserGroupIcon} iconBg="#EAF0FF" iconColor="#2869FF" title="Total users" variant="stat" />
          <AnalyticsCardSkeleton icon={MessageMultipleIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Active communities" variant="stat" />
          <AnalyticsCardSkeleton icon={AiContentGeneratorIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Content created" variant="stat" />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={UserGroupIcon} iconBg="#FFF2EA" iconColor="#FF7728" title="Active users" variant="stat" />
          <AnalyticsCardSkeleton icon={ActivityIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="User activity breakdown" variant="chart" />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={MessageMultipleIcon} iconBg="#EAF7FF" iconColor="#28B0FF" title="Total communities" variant="stat" />
          <AnalyticsCardSkeleton icon={ThumbsUpIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Total Interactions" variant="donut" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupIcon}
          iconBg="#EAF0FF"
          iconColor="#2869FF"
          title="Total users"
          value={data.totalUsers.value}
          trend={data.totalUsers.trend}
          description={data.totalUsers.description}
        />
        <StatCard
          icon={MessageMultipleIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="Active communities"
          value={data.activeCommunities.value}
          trend={data.activeCommunities.trend}
          description={data.activeCommunities.description}
        />
        <StatCard
          icon={AiContentGeneratorIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Content created"
          value={data.contentCreated.value}
          trend={data.contentCreated.trend}
          description={data.contentCreated.description}
          breakdown={data.contentCreated.breakdown}
        />
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupIcon}
          iconBg="#FFF2EA"
          iconColor="#FF7728"
          title="Active users"
          value={data.activeUsers.value}
          trend={data.activeUsers.trend}
          description={data.activeUsers.description}
        />
        <BarChartCard
          icon={ActivityIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="User activity breakdown"
          footnote="Distribution of how users engage with the platform"
          footnotePosition="top"
          data={data.userActivityBreakdown.data}
          activeLabel={data.userActivityBreakdown.activeLabel}
        />
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={MessageMultipleIcon}
          iconBg="#EAF7FF"
          iconColor="#28B0FF"
          title="Total communities"
          value={data.totalCommunities.value}
          trend={data.totalCommunities.trend}
          description={data.totalCommunities.description}
        />
        <DonutChartCard
          icon={ThumbsUpIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Total Interactions"
          centerValue={data.totalInteractions.centerValue}
          segments={data.totalInteractions.segments}
        />
      </div>
    </div>
  );
}
