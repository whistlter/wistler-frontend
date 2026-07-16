import { UserGroupAltIcon } from "@/components/icons/UserGroupAltIcon";
import { StatCard } from "@/components/charts/StatCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { TrendAreaChartCard } from "@/components/charts/TrendAreaChartCard";
import { useUserBehaviorAnalytics } from "@/features/analytics";

export function UserBehaviorTab() {
  const { data } = useUserBehaviorAnalytics();
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Daily active users (DAU)"
          value={data.dailyActiveUsers.value}
          description={data.dailyActiveUsers.description}
        />
        <BarChartCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Weekly active users (WAU)"
          data={data.weeklyActiveUsers.data}
          activeLabel={data.weeklyActiveUsers.activeLabel}
        />
      </div>

      <div className="flex flex-col gap-4">
        <StatCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Sessions per user"
          value={data.sessionsPerUser.value}
          description={data.sessionsPerUser.description}
        />
        <BarChartCard
          icon={UserGroupAltIcon}
          iconBg="#EAEDFF"
          iconColor="#2845FF"
          title="Monthly active users (MAU)"
          data={data.monthlyActiveUsers.data}
          activeLabel={data.monthlyActiveUsers.activeLabel}
        />
      </div>

      <TrendAreaChartCard
        icon={UserGroupAltIcon}
        iconBg="#EAEDFF"
        iconColor="#2845FF"
        title="Average session duration"
        data={data.averageSessionDuration.data}
        value={data.averageSessionDuration.value}
        valueLabel={data.averageSessionDuration.valueLabel}
        valuePosition="top"
        trend={data.averageSessionDuration.trend}
      />
    </div>
  );
}
