// Moment post/comment types

export type MomentPostRowDTO = {
    id: number;
    status: string;
    user_id: number;
    user_name: string;
    user_image?: string | null;
    user_status: string;
    post_content: string;
    topic: string;
    category: string;
    likes: string;
    replies: string;
    date_posted: string;
    image?: string | null;
    raw_post?: string;
    flags_count: number;
    reports_count: number;
    reach_count: number;
    participants_count: number;
};

export type MomentPostApi = {
    id: number;
    moment_id?: number;
    user_id?: number;
    comment_id?: number | null;
    comment?: string;                   // actual field name from comments API
    post?: string;                      // kept for legacy compatibility
    image?: string | null;
    likes_count?: number;
    comments_count?: number;
    is_anonymous?: string;
    status?: string;
    referring_username?: string;
    createdAt?: string;
    updatedAt?: string;
    // legacy fields (not in current API response)
    flags_count?: number;
    reports_count?: number;
    reach_count?: number;
    participants_count?: number;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        image?: string | null;
        status?: string;
    };
    moment?: {
        id: number;
        post?: string;                  // API field for moment content
        title?: string;                 // legacy
        description?: string;
        interest?: {
            id: number;
            title: string;
        };
    };
};

export function mapMomentPostToRowDTO(post: MomentPostApi): MomentPostRowDTO {
    const userName = post.user
        ? `${post.user.first_name ?? ''} ${post.user.last_name ?? ''}`.trim() || post.user.username
        : 'Unknown';
    const content = post.comment ?? post.post ?? '';

    return {
        id: post.id,
        status: post.status ?? 'active',
        user_id: post.user?.id ?? 0,
        user_name: userName,
        user_image: post.user?.image,
        user_status: post.user?.status ?? 'active',
        post_content: content,
        topic: post.moment?.post ?? post.moment?.title ?? 'N/A',
        category: post.moment?.interest?.title ?? 'N/A',
        likes: (post.likes_count ?? 0).toString(),
        replies: (post.comments_count ?? 0).toString(),
        date_posted: post.createdAt
            ? new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })
            : 'N/A',
        image: post.image,
        raw_post: content,
        flags_count: post.flags_count ?? 0,
        reports_count: post.reports_count ?? 0,
        reach_count: post.reach_count ?? 0,
        participants_count: post.participants_count ?? 0,
    };
}
