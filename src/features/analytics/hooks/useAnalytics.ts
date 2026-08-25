import { useGet } from "@/hooks/useApi";
import type {
  OverviewAnalytics,
  OverviewStatsResponse,
  GrowthRetentionAnalytics,
  GrowthRetentionStatsResponse,
  ContentPerformanceAnalytics,
  ContentPerformanceStatsResponse,
  MomentsInsightsAnalytics,
  MomentInsightStatsResponse,
  StatMetric,
  AnalyticsChange,
  AnalyticsMetric,
  AnalyticsMetricWithScore,
} from "../types/analytics.types";

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function buildDateQuery(startDate?: string, endDate?: string): string {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function toTrend(change: { percentage: number; direction: "up" | "down" }) {
  const sign = change.percentage > 0 ? "+" : "";
  return { direction: change.direction, label: `${sign}${change.percentage}%` };
}

function mapOverviewResponse(response: OverviewStatsResponse): OverviewAnalytics | undefined {
  if (!response?.payload) return undefined;
  const { overview, interactionRecords } = response.payload;

  const likes = interactionRecords.likes + interactionRecords.momentLikes;
  const comments = interactionRecords.comments + interactionRecords.mcomments;
  const replies = interactionRecords.replies + interactionRecords.mreplies;
  const reactions = interactionRecords.momentReactions;

  const activityData = [
    { label: "Posting", value: interactionRecords.posts + interactionRecords.moments },
    { label: "Commenting", value: comments },
    { label: "Replying", value: replies },
    { label: "Reacting", value: likes + reactions },
  ];
  const activeLabel = activityData.reduce((max, item) => (item.value > max.value ? item : max)).label;

  return {
    totalUsers: {
      value: formatNumber(overview.totalUsers.total),
      description: overview.totalUsers.label,
    },
    activeUsers: {
      value: formatNumber(overview.activeUsers.total),
      trend: toTrend(overview.activeUsers.score.change),
      description: overview.activeUsers.label,
    },
    totalCommunities: {
      value: formatNumber(overview.totalCommunities.total),
      description: overview.totalCommunities.label,
    },
    activeCommunities: {
      value: formatNumber(overview.activeCommunities.total),
      trend: toTrend(overview.activeCommunities.score.change),
      description: overview.activeCommunities.label,
    },
    contentCreated: {
      value: formatNumber(overview.contentCreated.total),
      trend: toTrend(overview.contentCreated.change),
      description: overview.contentCreated.label || "Posts and Moments shared in the selected period",
      breakdown: [
        { label: `Posts: ${formatNumber(overview.contentCreated.activePosts)}`, color: "#0A68FF" },
        { label: `Moments: ${formatNumber(overview.contentCreated.totalMoment)}`, color: "#FF2860" },
      ],
    },
    userActivityBreakdown: {
      data: activityData,
      activeLabel,
      legend: activityData.map((item) => ({
        label: item.label,
        color: item.label === activeLabel ? "#2873FF" : "#EFEFEF",
      })),
    },
    totalInteractions: {
      centerValue: formatNumber(likes + comments + replies + reactions),
      segments: [
        { label: "Likes", value: likes, displayValue: formatNumber(likes), color: "#324DFF" },
        { label: "Comments", value: comments, displayValue: formatNumber(comments), color: "#FF9F0A" },
        { label: "Reactions", value: reactions, displayValue: formatNumber(reactions), color: "#3FC8E4" },
        { label: "Replies", value: replies, displayValue: formatNumber(replies), color: "#1DBF73" },
      ],
    },
  };
}

function toStatMetric(metric?: AnalyticsMetric | AnalyticsMetricWithScore): StatMetric | undefined {
  if (!metric || typeof metric.total !== "number") return undefined;
  const change: AnalyticsChange | undefined = (metric as AnalyticsMetricWithScore)?.score?.change;
  return {
    value: formatNumber(metric.total),
    trend: change ? toTrend(change) : undefined,
    description: metric.label ?? "",
  };
}

function mapGrowthRetentionResponse(response: GrowthRetentionStatsResponse): GrowthRetentionAnalytics | undefined {
  const payload = response?.payload;
  if (!payload) return undefined;

  const growthRate = payload.growth?.growthRate;
  const newUsersMetric = payload.growth?.newUsers;
  const trend = payload.userGrowthTrend;
  const graph = Array.isArray(trend?.graph) ? trend.graph : [];
  const currentMonthPoint = graph.find((point) => point.monthKey === trend?.period?.currentMonth);

  return {
    userGrowthRate:
      growthRate && typeof growthRate.total === "string"
        ? {
            value: growthRate.total,
            trend: growthRate.score?.change ? toTrend(growthRate.score.change) : undefined,
            description: growthRate.label ?? "",
          }
        : undefined,
    newUsers: toStatMetric(newUsersMetric),
    userGrowthTrend:
      graph.length > 0
        ? {
            data: graph.map((point) => ({ label: point.month, value: point.totalUsers })),
            activeLabel: currentMonthPoint?.month ?? "",
            value: `${formatNumber(trend?.summary?.currentMonthUsers ?? 0)} Users`,
            trend: trend?.summary?.change ? toTrend(trend.summary.change) : { direction: "up", label: "" },
          }
        : undefined,
  };
}

function mapContentPerformanceResponse(
  response: ContentPerformanceStatsResponse,
): ContentPerformanceAnalytics | undefined {
  const payload = response?.payload;
  if (!payload) return undefined;
  const performance = payload.performance;

  return {
    postsCreated: toStatMetric(performance?.posts),
    momentsCreated: toStatMetric(performance?.moments),
    commentsPerPost: toStatMetric(performance?.postComments),
  };
}

function mapMomentInsightResponse(response: MomentInsightStatsResponse): MomentsInsightsAnalytics | undefined {
  const payload = response?.payload;
  if (!payload) return undefined;

  const performance = payload.performance;
  const topMoments = payload.insightRecords?.topMoments;
  const trend = payload.momentGrowthTrend;
  const graph = Array.isArray(trend?.graph) ? trend.graph : [];
  const currentMonthPoint = graph.find((point) => point.monthKey === trend?.period?.currentMonth);

  return {
    momentsCreated: toStatMetric(performance?.moments),
    engagementPerMoment: toStatMetric(performance?.averageEngagement),
    topMoments: Array.isArray(topMoments)
      ? topMoments.map((moment) => ({
          id: String(moment.id),
          category: "Moment",
          title: moment.post,
          likes: moment.likes_count,
          comments: moment.comments_count,
          image: moment.image,
        }))
      : undefined,
    momentsActivityTrend:
      graph.length > 0
        ? {
            data: graph.map((point) => ({ label: point.month, value: point.totalMoments })),
            activeLabel: currentMonthPoint?.month ?? "",
            value: `${formatNumber(trend?.summary?.currentMonthMoments ?? 0)} moments`,
            trend: trend?.summary?.change ? toTrend(trend.summary.change) : { direction: "up", label: "" },
          }
        : undefined,
  };
}

export function useOverviewAnalytics(startDate?: string, endDate?: string) {
  const query = useGet<OverviewStatsResponse>(
    ["analytics", "overview", startDate ?? "", endDate ?? ""],
    `admin/analytics/overview${buildDateQuery(startDate, endDate)}`,
    { staleTime: 5 * 60 * 1000 },
  );

  return {
    ...query,
    data: query.data ? mapOverviewResponse(query.data) : undefined,
  };
}

export function useGrowthRetentionAnalytics(startDate?: string, endDate?: string) {
  const query = useGet<GrowthRetentionStatsResponse>(
    ["analytics", "growth-retention", startDate ?? "", endDate ?? ""],
    `admin/analytics/growth-retention${buildDateQuery(startDate, endDate)}`,
    { staleTime: 5 * 60 * 1000 },
  );

  return {
    ...query,
    data: query.data ? mapGrowthRetentionResponse(query.data) : undefined,
  };
}

export function useContentPerformanceAnalytics(startDate?: string, endDate?: string) {
  const query = useGet<ContentPerformanceStatsResponse>(
    ["analytics", "content-performance", startDate ?? "", endDate ?? ""],
    `admin/analytics/content-performance${buildDateQuery(startDate, endDate)}`,
    { staleTime: 5 * 60 * 1000 },
  );

  return {
    ...query,
    data: query.data ? mapContentPerformanceResponse(query.data) : undefined,
  };
}

export function useMomentsInsightsAnalytics(startDate?: string, endDate?: string) {
  const query = useGet<MomentInsightStatsResponse>(
    ["analytics", "moments-insights", startDate ?? "", endDate ?? ""],
    `admin/analytics/moment-insight${buildDateQuery(startDate, endDate)}`,
    { staleTime: 5 * 60 * 1000 },
  );

  return {
    ...query,
    data: query.data ? mapMomentInsightResponse(query.data) : undefined,
  };
}
