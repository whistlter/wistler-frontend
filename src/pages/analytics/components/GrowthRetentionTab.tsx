import { UserGroupIcon } from "@/components/icons/UserGroupIcon";
import { UserGroupAltIcon } from "@/components/icons/UserGroupAltIcon";
import { TrendingUpDownIcon } from "@/components/icons/TrendingUpDownIcon";
import { StatCard } from "@/components/charts/StatCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { TrendAreaChartCard } from "@/components/charts/TrendAreaChartCard";
import { RadialRingsCard } from "@/components/charts/RadialRingsCard";
import { useGrowthRetentionAnalytics } from "@/features/analytics";

export function GrowthRetentionTab() {
  const { data } = useGrowthRetentionAnalytics();
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="User growth rate"
          value={data.userGrowthRate.value}
          trend={data.userGrowthRate.trend}
          description={data.userGrowthRate.description}
        />
        <RadialRingsCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Retention rate"
          footnote="Percentage of users who return after their first visit"
          centerValue={data.retentionRate.centerValue}
          rings={data.retentionRate.rings}
        />
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="New users"
          value={data.newUsers.value}
          trend={data.newUsers.trend}
          description={data.newUsers.description}
        />
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
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupIcon}
          iconBg="#F5EAFF"
          iconColor="#9B28FF"
          title="Returning users"
          value={data.returningUsers.value}
          trend={data.returningUsers.trend}
          description={data.returningUsers.description}
        />
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
      </div>
    </div>
  );
}
