import { useGet } from "@/hooks/useApi";
import type { ModerationActivityApi, ModerationStatsApi } from "@/mocks/moderator.mock";

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