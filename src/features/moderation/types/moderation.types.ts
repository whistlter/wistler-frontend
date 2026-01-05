// src/dto/user-row.dto.ts
export type ModeratorRowDTO = {
    id: number;
    name: string;
    email: string;
    communities: number;
    status: "Active" | "Inactive";
    joinedDate: string;
};

// src/api/types/user.api.ts
export type ModeratorApi = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    communities_count: number;
    is_active: boolean;
    joined_at: string; // ISO date
};

export function mapUserToRowDTO(user: ModeratorApi): ModeratorRowDTO {
    return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        communities: user.communities_count,
        status: user.is_active ? "Active" : "Inactive",
        joinedDate: new Date(user.joined_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    };
}

// src/api/types/moderation.api.ts
export type FlaggedContentApi = {
    id: number;
    content_preview: string;
    reason: string;
    flags_count: number;
    community_name: string;
};

export type FlaggedContentRowDTO = {
    id: number;
    content_preview: string;
    reason: string;
    flags: string;
    community: string;
    status: string; // Required by Table component constraint
};

export function mapFlaggedContentToRowDTO(content: FlaggedContentApi): FlaggedContentRowDTO {
    return {
        id: content.id,
        content_preview: content.content_preview,
        reason: content.reason,
        flags: content.flags_count.toString(),
        community: content.community_name,
        status: "Active", // Dummy status
    };
}

export type ReviewQueueApi = {
    id: number;
    content: string;
    reason: string;
    created_at: string; // ISO date
};

export type ReviewQueueRowDTO = {
    id: number;
    content: string;
    reason: string;
    date: string;
    status: string; // Required by Table component constraint
};

export function mapReviewQueueToRowDTO(item: ReviewQueueApi): ReviewQueueRowDTO {
    return {
        id: item.id,
        content: item.content,
        reason: item.reason,
        date: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        status: "Active", // Dummy status
    };
}