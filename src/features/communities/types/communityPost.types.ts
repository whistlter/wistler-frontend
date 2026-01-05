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
    caption: string;
    author: string;
    flags_count: number;
    is_active: boolean;
    created_at: string; // ISO date
};

export function mapCommunityPostToRowDTO(post: CommunitiesPostApi): CommunitiesPostRowDTO {
    return {
        id: post.id,
        caption: post.caption,
        author: post.author,
        flags: post.flags_count.toString(),
        status: post.is_active ? "Active" : "Inactive",
        Posted_on: new Date(post.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    };
}