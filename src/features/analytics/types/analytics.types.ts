import type { TrendInfo } from "@/components/charts/types";
import type { BarDatum } from "@/components/charts/BarChartCard";
import type { DonutSegment } from "@/components/charts/DonutChartCard";
import type { AreaDatum } from "@/components/charts/TrendAreaChartCard";
import type { RankingItem } from "@/components/charts/RankingListCard";
import type { RadialRing } from "@/components/charts/RadialRingsCard";
import type { FunnelStep } from "@/components/charts/FunnelCard";
import type { ContentPreviewItem } from "@/components/charts/ContentPreviewList";
import type { StatBreakdownItem } from "@/components/charts/StatCard";

export interface StatMetric {
  value: string;
  trend?: TrendInfo;
  description: string;
  breakdown?: StatBreakdownItem[];
}

export interface OverviewAnalytics {
  totalUsers: StatMetric;
  activeUsers: StatMetric;
  totalCommunities: StatMetric;
  activeCommunities: StatMetric;
  contentCreated: StatMetric;
  userActivityBreakdown: {
    data: BarDatum[];
    activeLabel: string;
    legend: { label: string; color: string }[];
  };
  totalInteractions: {
    segments: DonutSegment[];
    centerValue: string;
  };
}

export interface UserBehaviorAnalytics {
  weeklyActiveUsers: { data: BarDatum[]; activeLabel: string };
  sessionsPerUser: StatMetric;
  monthlyActiveUsers: { data: BarDatum[]; activeLabel: string };
  dailyActiveUsers: StatMetric;
  averageSessionDuration: {
    data: AreaDatum[];
    value: string;
    valueLabel: string;
    trend: TrendInfo;
  };
}

export interface GrowthRetentionAnalytics {
  userGrowthTrend: { data: AreaDatum[]; activeLabel: string; value: string; trend: TrendInfo };
  userComposition: { data: BarDatum[]; activeLabel: string; legend: { label: string; color: string }[] };
  userGrowthRate: StatMetric;
  retentionRate: { centerValue: string; rings: RadialRing[] };
  newUsers: StatMetric;
  returningUsers: StatMetric;
}

export interface ContentPerformanceAnalytics {
  topMoments: ContentPreviewItem[];
  topPosts: ContentPreviewItem[];
  postsCreated: StatMetric;
  averageViewsPerMoment: StatMetric;
  completionRate: StatMetric;
  momentsCreated: StatMetric;
  commentsPerPost: StatMetric;
}

export interface CommunityPerformanceAnalytics {
  communityActivityStatus: { segments: DonutSegment[]; centerValue: string; trend: TrendInfo };
  mostActiveCommunities: RankingItem[];
  postsPerCommunity: { data: BarDatum[]; activeLabel: string };
  engagementPerCommunity: { data: BarDatum[]; activeLabel: string };
  communityGrowthRate: StatMetric;
  averageMembersPerCommunity: StatMetric;
}

export interface MomentsInsightsAnalytics {
  engagementPerMoment: StatMetric;
  averageViewsPerMoment: StatMetric;
  usersDropOff: { steps: FunnelStep[]; value: string; trend: TrendInfo };
  topMoments: ContentPreviewItem[];
  momentsActivityTrend: { data: AreaDatum[]; activeLabel: string; value: string; trend: TrendInfo };
  momentsCreated: StatMetric;
  activeMoments: StatMetric;
}

// Shared shapes used across the admin/analytics/* raw API responses.
export interface AnalyticsChange {
  percentage: number;
  direction: "up" | "down";
}

export interface AnalyticsScore {
  value: number;
  previous_value: number;
  change: AnalyticsChange;
}

export interface AnalyticsMetric {
  total: number;
  label: string;
}

export interface AnalyticsMetricWithScore extends AnalyticsMetric {
  score: AnalyticsScore;
}

export interface AnalyticsPeriod {
  startDate: string;
  endDate: string;
  previousStartDate: string;
  previousEndDate: string;
}

// Raw shape returned by GET admin/analytics/overview
export interface OverviewStatsContentCreated {
  total: number;
  previous: number;
  totalMoment: number;
  activePosts: number;
  change: AnalyticsChange;
  label: string;
}

export interface OverviewStatsResponse {
  message: string;
  payload: {
    period: AnalyticsPeriod;
    overview: {
      totalUsers: AnalyticsMetric;
      activeUsers: AnalyticsMetricWithScore;
      totalCommunities: AnalyticsMetric;
      activeCommunities: AnalyticsMetricWithScore;
      contentCreated: OverviewStatsContentCreated;
      comments: { total: number };
    };
    interactionRecords: {
      posts: number;
      moments: number;
      likes: number;
      momentLikes: number;
      momentReactions: number;
      comments: number;
      replies: number;
      mcomments: number;
      mreplies: number;
    };
  };
  status: string;
}
