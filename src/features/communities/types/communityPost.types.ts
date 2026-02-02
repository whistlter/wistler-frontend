// src/dto/user-row.dto.ts
export type CommunitiesPostRowDTO = {
    id: number;
    caption: string;
    author: string;
    flags: string;
    status: "Active" | "Inactive";
    Posted_on: string;
};

// src/api/types/communityPost.api.ts
export type CommunitiesPostApi = {
    id: number;
    community_id: number;
    user_id: number;
    post: string;
    image: string;
    likes_count: number;
    comments_count: number;
    is_anonymous: string;
    status: string;
    is_pinned: boolean;
    deleted_at: string | null;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        username: string;
        image: string;
    };
};

export function mapCommunityPostToRowDTO(post: CommunitiesPostApi): CommunitiesPostRowDTO {
    const authorName = post.is_anonymous === 'y'
        ? 'Anonymous'
        : `${post.user?.first_name ?? ''} ${post.user?.last_name ?? ''}`.trim() || 'Unknown';

    return {
        id: post.id ?? 0,
        caption: post.post ?? '',
        author: authorName,
        flags: '0', // No flags field in response, default to 0
        status: post.status === 'active' ? "Active" : "Inactive",
        Posted_on: post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }) : '',
    };
}