import { useQuery } from "@tanstack/react-query";
import { useGet } from "@/hooks/useApi";
import {
  userBehaviorAnalyticsMock,
  growthRetentionAnalyticsMock,
  contentPerformanceAnalyticsMock,
  communityPerformanceAnalyticsMock,
  momentsInsightsAnalyticsMock,
} from "../data/mockAnalytics";
import type { OverviewAnalytics, OverviewStatsResponse } from "../types/analytics.types";

// NOTE: the remaining hooks below still resolve local mock data shaped like a
// future API response. Swapping one to a real endpoint later only requires
// replacing the `queryFn` with `() => api.get<T>('admin/analytics/...')`
// (see useGet in src/hooks/useApi.ts), following the pattern used by useOverviewAnalytics.
function mockQuery<T>(key: string, data: T) {
  return () =>
    useQuery<T>({
      queryKey: ["analytics", key],
      queryFn: () => Promise.resolve(data),
      staleTime: 5 * 60 * 1000,
    });
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
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

export function useOverviewAnalytics() {
  const query = useGet<OverviewStatsResponse>(["analytics", "overview"], "admin/analytics/overview", {
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    data: query.data ? mapOverviewResponse(query.data) : undefined,
  };
}

export const useUserBehaviorAnalytics = mockQuery("user-behavior", userBehaviorAnalyticsMock);
export const useGrowthRetentionAnalytics = mockQuery("growth-retention", growthRetentionAnalyticsMock);
export const useContentPerformanceAnalytics = mockQuery("content-performance", contentPerformanceAnalyticsMock);
export const useCommunityPerformanceAnalytics = mockQuery("community-performance", communityPerformanceAnalyticsMock);
export const useMomentsInsightsAnalytics = mockQuery("moments-insights", momentsInsightsAnalyticsMock);
