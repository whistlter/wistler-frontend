import { useQuery } from "@tanstack/react-query";
import {
  overviewAnalyticsMock,
  userBehaviorAnalyticsMock,
  growthRetentionAnalyticsMock,
  contentPerformanceAnalyticsMock,
  communityPerformanceAnalyticsMock,
  momentsInsightsAnalyticsMock,
} from "../data/mockAnalytics";

// NOTE: these hooks currently resolve local mock data shaped like a future
// API response. Swapping to a real endpoint later only requires replacing the
// `queryFn` with `() => api.get<T>('admin/dashboard/analytics/...')` (see useGet in src/hooks/useApi.ts).
function mockQuery<T>(key: string, data: T) {
  return () =>
    useQuery<T>({
      queryKey: ["analytics", key],
      queryFn: () => Promise.resolve(data),
      staleTime: 5 * 60 * 1000,
    });
}

export const useOverviewAnalytics = mockQuery("overview", overviewAnalyticsMock);
export const useUserBehaviorAnalytics = mockQuery("user-behavior", userBehaviorAnalyticsMock);
export const useGrowthRetentionAnalytics = mockQuery("growth-retention", growthRetentionAnalyticsMock);
export const useContentPerformanceAnalytics = mockQuery("content-performance", contentPerformanceAnalyticsMock);
export const useCommunityPerformanceAnalytics = mockQuery("community-performance", communityPerformanceAnalyticsMock);
export const useMomentsInsightsAnalytics = mockQuery("moments-insights", momentsInsightsAnalyticsMock);
