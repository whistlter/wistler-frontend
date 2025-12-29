export type ModerationStatsApi = {
    flagged_posts: number;
    flagged_comments: number;
    items_in_review: number;
    user_reports: number;
};

export type ModerationActivityApi = {
    id: number;
    action: string;
    description: string;
    badge?: string;
    time: string;
};

export const MODERATION_STATS_DB: ModerationStatsApi = {
    flagged_posts: 2348,
    flagged_comments: 189,
    items_in_review: 344,
    user_reports: 344,
};

export const MODERATION_ACTIVITY_DB: ModerationActivityApi[] = Array.from(
    { length: 12 },
    (_, i) => ({
        id: i + 1,
        action: [
            "Added a comment",
            "Edited a comment",
            "Deleted a comment",
            "Comment flagged for review",
        ][i % 4],
        description:
            i % 4 === 0
                ? "Commented on a post in"
                : "Updated a comment",
        badge: i % 4 === 0 ? "Backyard by tony" : undefined,
        time: "Today at 14:32",
    })
);