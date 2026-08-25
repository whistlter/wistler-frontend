import { StatusDotIcon } from "@/components/icons/StatusDotIcon";
import { ViewIcon } from "@/components/icons/ViewIcon";
import { AnalysisTextLinkIcon } from "@/components/icons/AnalysisTextLinkIcon";
import { StatCard } from "@/components/charts/StatCard";
import { FunnelCard } from "@/components/charts/FunnelCard";
import { ContentPreviewList } from "@/components/charts/ContentPreviewList";
import { TrendAreaChartCard } from "@/components/charts/TrendAreaChartCard";
import { ComingSoonCard } from "@/components/charts/ComingSoonCard";
import { AnalyticsCardSkeleton } from "@/components/charts/AnalyticsCardSkeleton";
import { useMomentsInsightsAnalytics } from "@/features/analytics";

type Props = {
  startDate?: string;
  endDate?: string;
};

export function MomentsInsightsTab({ startDate, endDate }: Props) {
  const { data: rawData, isLoading } = useMomentsInsightsAnalytics(startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Moments created" variant="stat" />
            <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Active moments" variant="stat" />
          </div>
          <div className="flex flex-col gap-4">
            <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#EBEAFF" iconColor="#2F28FF" title="Engagement per moment" variant="stat" />
            <AnalyticsCardSkeleton icon={ViewIcon} iconBg="#F9EAFF" iconColor="#BE28FF" title="Average views per moment" variant="stat" />
          </div>
          <AnalyticsCardSkeleton icon={AnalysisTextLinkIcon} iconBg="#FFF2EA" iconColor="#FF7728" title="Users drop off" variant="funnel" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Top moments" variant="list" />
          <AnalyticsCardSkeleton icon={StatusDotIcon} iconBg="#EBEAFF" iconColor="#2F28FF" title="Moments activity trend" variant="chart" height={150} />
        </div>
      </div>
    );
  }

  const data = rawData ?? {};

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          {data.momentsCreated ? (
            <StatCard
              icon={StatusDotIcon}
              iconBg="#F5EAFF"
              iconColor="#9B28FF"
              title="Moments created"
              value={data.momentsCreated.value}
              trend={data.momentsCreated.trend}
              description={data.momentsCreated.description}
            />
          ) : (
            <ComingSoonCard icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Moments created" height={60} />
          )}
          {data.activeMoments ? (
            <StatCard
              icon={StatusDotIcon}
              iconBg="#EAEDFF"
              iconColor="#2845FF"
              title="Active moments"
              value={data.activeMoments.value}
              trend={data.activeMoments.trend}
              description={data.activeMoments.description}
            />
          ) : (
            <ComingSoonCard icon={StatusDotIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Active moments" height={60} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {data.engagementPerMoment ? (
            <StatCard
              icon={StatusDotIcon}
              iconBg="#EBEAFF"
              iconColor="#2F28FF"
              title="Engagement per moment"
              value={data.engagementPerMoment.value}
              trend={data.engagementPerMoment.trend}
              description={data.engagementPerMoment.description}
            />
          ) : (
            <ComingSoonCard icon={StatusDotIcon} iconBg="#EBEAFF" iconColor="#2F28FF" title="Engagement per moment" height={60} />
          )}
          {data.averageViewsPerMoment ? (
            <StatCard
              icon={ViewIcon}
              iconBg="#F9EAFF"
              iconColor="#BE28FF"
              title="Average views per moment"
              value={data.averageViewsPerMoment.value}
              trend={data.averageViewsPerMoment.trend}
              description={data.averageViewsPerMoment.description}
            />
          ) : (
            <ComingSoonCard icon={ViewIcon} iconBg="#F9EAFF" iconColor="#BE28FF" title="Average views per moment" height={60} />
          )}
        </div>

        {data.usersDropOff ? (
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
        ) : (
          <ComingSoonCard icon={AnalysisTextLinkIcon} iconBg="#FFF2EA" iconColor="#FF7728" title="Users drop off" />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data.topMoments ? (
          <ContentPreviewList
            icon={StatusDotIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="Top moments"
            items={data.topMoments}
          />
        ) : (
          <ComingSoonCard icon={StatusDotIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Top moments" />
        )}
        {data.momentsActivityTrend ? (
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
        ) : (
          <ComingSoonCard icon={StatusDotIcon} iconBg="#EBEAFF" iconColor="#2F28FF" title="Moments activity trend" />
        )}
      </div>
    </div>
  );
}
