import { StatusDotIcon } from "@/components/icons/StatusDotIcon";
import { ViewIcon } from "@/components/icons/ViewIcon";
import { AnalysisTextLinkIcon } from "@/components/icons/AnalysisTextLinkIcon";
import { StatCard } from "@/components/charts/StatCard";
import { FunnelCard } from "@/components/charts/FunnelCard";
import { ContentPreviewList } from "@/components/charts/ContentPreviewList";
import { TrendAreaChartCard } from "@/components/charts/TrendAreaChartCard";
import { useMomentsInsightsAnalytics } from "@/features/analytics";

export function MomentsInsightsTab() {
  const { data } = useMomentsInsightsAnalytics();
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <StatCard
            icon={StatusDotIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="Moments created"
            value={data.momentsCreated.value}
            trend={data.momentsCreated.trend}
            description={data.momentsCreated.description}
          />
          <StatCard
            icon={StatusDotIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="Active moments"
            value={data.activeMoments.value}
            trend={data.activeMoments.trend}
            description={data.activeMoments.description}
          />
        </div>

        <div className="flex flex-col gap-4">
          <StatCard
            icon={StatusDotIcon}
            iconBg="#EBEAFF"
            iconColor="#2F28FF"
            title="Engagement per moment"
            value={data.engagementPerMoment.value}
            trend={data.engagementPerMoment.trend}
            description={data.engagementPerMoment.description}
          />
          <StatCard
            icon={ViewIcon}
            iconBg="#F9EAFF"
            iconColor="#BE28FF"
            title="Average views per moment"
            value={data.averageViewsPerMoment.value}
            trend={data.averageViewsPerMoment.trend}
            description={data.averageViewsPerMoment.description}
          />
        </div>

        <FunnelCard
          icon={AnalysisTextLinkIcon}
          iconBg="#FFF2EA"
          iconColor="#FF7728"
          title="Users drop off"
          footnote="Tracks where users stop following moments"
          steps={data.usersDropOff.steps}
          value={data.usersDropOff.value}
          trend={data.usersDropOff.trend}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ContentPreviewList
          icon={StatusDotIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="Top moments"
          items={data.topMoments}
        />
        <TrendAreaChartCard
          icon={StatusDotIcon}
          iconBg="#EBEAFF"
          iconColor="#2F28FF"
          title="Moments activity trend"
          footnote="Tracks how often moments are created over time."
          data={data.momentsActivityTrend.data}
          activeLabel={data.momentsActivityTrend.activeLabel}
          value={data.momentsActivityTrend.value}
          trend={data.momentsActivityTrend.trend}
          curveType="linear"
          showDots={false}
          showReferenceLine
        />
      </div>
    </div>
  );
}
