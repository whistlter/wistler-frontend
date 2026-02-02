import type { CommunitiesApi } from "@/features/communities/types/community.types";
import type { CommunitiesMembersApi } from "@/features/communities/types/communityMember.types";
import type { CommunitiesPostApi } from "@/features/communities/types/communityPost.types";
import type { FlaggedContentApi, ReviewQueueApi } from "@/features/moderation/types/moderation.types";
import type { UserCommunityApi } from "@/features/users/types/user.types";

export const COMMUNITIES_DB: CommunitiesApi[] = Array.from(
    { length: 25 },
    (_, i) => ({
        id: i + 1,
        user_id: Math.floor(Math.random() * 100) + 1,
        code: `COMM${i + 1}`,
        image: null,
        title: `Community ${i + 1}`,
        desc: `Description for community ${i + 1}`,
        visibility: i % 3 === 0 ? "private" : "public",
        is_safe_space: false,
        is_member_screening: false,
        can_post_anonymously: true,
        has_post_contents: true,
        is_deleted: false,
        is_suspended: i % 5 === 0,
        status: i % 5 !== 0 ? "active" : "in-active",
        createdAt: new Date(Date.now() - i * 86_400_000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - i * 86_400_000 * 2).toISOString(),
        members_count: Math.floor(Math.random() * 5000) + 100,
    })
);

export const COMMUNITY_MEMBERS_DB: CommunitiesMembersApi[] = Array.from(
    { length: 50 },
    (_, i) => ({
        id: i + 1,
        name: `Member Name ${i + 1}`,
        role: i % 10 === 0 ? "Admin" : i % 5 === 0 ? "Moderator" : "Member",
        posts: `${Math.floor(Math.random() * 150)}`,
        last_seen: new Date(Date.now() - Math.random() * 10_000_000_000).toISOString(),
        is_active: i % 4 !== 0,
        joined_at: new Date(Date.now() - i * 86_400_000 * 5).toISOString(),
    })
);

export const COMMUNITY_POSTS_DB: CommunitiesPostApi[] = Array.from(
    { length: 40 },
    (_, i) => ({
        id: i + 1,
        community_id: Math.floor(Math.random() * 25) + 1,
        user_id: Math.floor(Math.random() * 100) + 1,
        post: `This is a sample post caption for post #${i + 1}. It contains some interesting content.`,
        image: "",
        likes_count: Math.floor(Math.random() * 100),
        comments_count: Math.floor(Math.random() * 50),
        is_anonymous: i % 5 === 0 ? "y" : "n",
        status: i % 10 !== 0 ? "active" : "inactive",
        is_pinned: i % 15 === 0,
        deleted_at: null,
        is_deleted: false,
        createdAt: new Date(Date.now() - i * 3600_000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - i * 3600_000 * 4).toISOString(),
        user: {
            id: Math.floor(Math.random() * 100) + 1,
            first_name: `First${i + 1}`,
            last_name: `Last${i + 1}`,
            email: `user${i + 1}@example.com`,
            username: `user${i + 1}`,
            image: "",
        },
    })
);

export const FLAGGED_CONTENT_DB: FlaggedContentApi[] = Array.from(
    { length: 30 },
    (_, i) => ({
        id: i + 1,
        content_preview: `This is a preview of flagged content #${i + 1}. It might contain prohibited material.`,
        reason: i % 3 === 0 ? "Spam" : i % 3 === 1 ? "Hate Speech" : "Harassment",
        flags_count: Math.floor(Math.random() * 50) + 1,
        community_name: `Community ${Math.floor(Math.random() * 10) + 1}`,
    })
);

export const REVIEW_QUEUE_DB: ReviewQueueApi[] = Array.from(
    { length: 20 },
    (_, i) => ({
        id: i + 1,
        content: `Review item content #${i + 1}. Pending moderator investigation.`,
        reason: i % 2 === 0 ? "Potential Spam" : "User Report",
        created_at: new Date(Date.now() - i * 86_400_000).toISOString(),
    })
);

export const USER_COMMUNITIES_DB: UserCommunityApi[] = Array.from(
    { length: 15 },
    (_, i) => ({
        id: i + 1,
        community_id: i + 100,
        user_id: 1,
        is_owner: i === 0,
        status: "accepted",
        privacy: "profile",
        is_deleted: false,
        createdAt: new Date(Date.now() - i * 15 * 86_400_000).toISOString(),
        updatedAt: new Date(Date.now() - i * 15 * 86_400_000).toISOString(),
        communityId: i + 100,
        userId: 1,
        community: {
            id: i + 100,
            user_id: i === 0 ? 1 : 99,
            code: `CODE${i + 100}`,
            image: null,
            title: `Community Title ${i + 1}`,
            desc: `Description for community ${i + 1}`,
            visibility: "private",
            is_safe_space: true,
            is_member_screening: true,
            can_post_anonymously: true,
            has_post_contents: false,
            is_deleted: false,
            createdAt: new Date(Date.now() - i * 15 * 86_400_000).toISOString(),
            updatedAt: new Date(Date.now() - i * 15 * 86_400_000).toISOString(),
            userId: i === 0 ? 1 : 99,
        }
    })
);
