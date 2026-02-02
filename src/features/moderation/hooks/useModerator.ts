import { useGet } from "@/hooks/useApi";

import type { FlaggedContentApi, ReviewQueueApi, ModerationActivityApi, ModerationStatsApi } from "../types/moderation.types";

export interface PaginatedFlaggedContent {
  data: FlaggedContentApi[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedReviewQueue {
  data: ReviewQueueApi[];
  total: number;
  page: number;
  pageSize: number;
}

export function useModeration() {
  const statsQuery = useGet<ModerationStatsApi>(
    ["moderation", "stats"],
    "/moderation/stats"
  );

  const activitiesQuery = useGet<ModerationActivityApi[]>(
    ["moderation", "activities"],
    "/moderation/activities"
  );

  const stats = statsQuery.data
    ? {
      flaggedPosts: statsQuery.data.flagged_posts,
      flaggedComments: statsQuery.data.flagged_comments,
      itemsInReview: statsQuery.data.items_in_review,
      userReports: statsQuery.data.user_reports,
    }
    : undefined;

  return {
    stats,
    activities: activitiesQuery.data ?? [],
    isLoading: statsQuery.isLoading || activitiesQuery.isLoading,
    isError: statsQuery.isError || activitiesQuery.isError,
    error: statsQuery.error || activitiesQuery.error, // ✅ ADD THIS
  };
}

export function useFlaggedContent(page: number, pageSize: number = 10, searchTerm?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
  });

  if (searchTerm && searchTerm.trim()) {
    params.append('search', searchTerm.trim());
  }

  return useGet<PaginatedFlaggedContent>(
    ['moderation', 'flagged', page.toString(), pageSize.toString(), searchTerm || ''],
    `/moderation/flagged?${params.toString()}`,
    {
      staleTime: 2 * 60 * 1000,
    }
  );
}

export function useReviewQueue(page: number, pageSize: number = 10, searchTerm?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
  });

  if (searchTerm && searchTerm.trim()) {
    params.append('search', searchTerm.trim());
  }

  return useGet<PaginatedReviewQueue>(
    ['moderation', 'review-queue', page.toString(), pageSize.toString(), searchTerm || ''],
    `/moderation/review-queue?${params.toString()}`,
    {
      staleTime: 2 * 60 * 1000,
    }
  );
}