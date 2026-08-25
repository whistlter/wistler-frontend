import { UserGroupIcon } from "@/components/icons/UserGroupIcon";
import { UserGroupAltIcon } from "@/components/icons/UserGroupAltIcon";
import { TrendingUpDownIcon } from "@/components/icons/TrendingUpDownIcon";
import { StatCard } from "@/components/charts/StatCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { TrendAreaChartCard } from "@/components/charts/TrendAreaChartCard";
import { RadialRingsCard } from "@/components/charts/RadialRingsCard";
import { ComingSoonCard } from "@/components/charts/ComingSoonCard";
import { AnalyticsCardSkeleton } from "@/components/charts/AnalyticsCardSkeleton";
import { useGrowthRetentionAnalytics } from "@/features/analytics";

type Props = {
  startDate?: string;
  endDate?: string;
};

export function GrowthRetentionTab({ startDate, endDate }: Props) {
  const { data: rawData, isLoading } = useGrowthRetentionAnalytics(startDate, endDate);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={UserGroupIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="User growth rate" variant="stat" />
          <AnalyticsCardSkeleton icon={UserGroupAltIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Retention rate" variant="radial" />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={UserGroupIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="New users" variant="stat" />
          <AnalyticsCardSkeleton icon={UserGroupAltIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="User composition" variant="chart" />
        </div>
        <div className="flex flex-col gap-4">
          <AnalyticsCardSkeleton icon={UserGroupIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Returning users" variant="stat" />
          <AnalyticsCardSkeleton icon={TrendingUpDownIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="User growth trend" variant="chart" height={150} />
        </div>
      </div>
    );
  }

  const data = rawData ?? {};

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        {data.userGrowthRate ? (
          <StatCard
            icon={UserGroupIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="User growth rate"
            value={data.userGrowthRate.value}
            trend={data.userGrowthRate.trend}
            description={data.userGrowthRate.description}
          />
        ) : (
          <ComingSoonCard icon={UserGroupIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="User growth rate" height={60} />
        )}
        {data.retentionRate ? (
          <RadialRingsCard
            icon={UserGroupAltIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="Retention rate"
            footnote="Percentage of users who return after their first visit"
            centerValue={data.retentionRate.centerValue}
            rings={data.retentionRate.rings}
          />
        ) : (
          <ComingSoonCard icon={UserGroupAltIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="Retention rate" />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {data.newUsers ? (
          <StatCard
            icon={UserGroupIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="New users"
            value={data.newUsers.value}
            trend={data.newUsers.trend}
            description={data.newUsers.description}
          />
        ) : (
          <ComingSoonCard icon={UserGroupIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="New users" height={60} />
        )}
        {data.userComposition ? (
          <BarChartCard
            icon={UserGroupAltIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="User composition"
            footnote="Compare new users with returning users over time"
            footnotePosition="top"
            legendPosition="top"
            data={data.userComposition.data}
            activeLabel={data.userComposition.activeLabel}
            legend={data.userComposition.legend}
          />
        ) : (
          <ComingSoonCard icon={UserGroupAltIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="User composition" />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {data.returningUsers ? (
          <StatCard
            icon={UserGroupIcon}
            iconBg="#F5EAFF"
            iconColor="#9B28FF"
            title="Returning users"
            value={data.returningUsers.value}
            trend={data.returningUsers.trend}
            description={data.returningUsers.description}
          />
        ) : (
          <ComingSoonCard icon={UserGroupIcon} iconBg="#F5EAFF" iconColor="#9B28FF" title="Returning users" height={60} />
        )}
        {data.userGrowthTrend ? (
          <TrendAreaChartCard
            icon={TrendingUpDownIcon}
            iconBg="#EAEDFF"
            iconColor="#2845FF"
            title="User growth trend"
            footnote="Tracks total users over time."
            data={data.userGrowthTrend.data}
            activeLabel={data.userGrowthTrend.activeLabel}
            value={data.userGrowthTrend.value}
            trend={data.userGrowthTrend.trend}
            valuePosition="top"
          />
        ) : (
          <ComingSoonCard icon={TrendingUpDownIcon} iconBg="#EAEDFF" iconColor="#2845FF" title="User growth trend" />
        )}
      </div>
    </div>
  );
}
