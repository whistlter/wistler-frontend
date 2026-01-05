// src/dto/user-row.dto.ts
export type CommunitiesMembersRowDTO = {
    id: number;
    name: string;
    role: string;
    posts: string;
    last_seen: string;
    status: "Active" | "Inactive";
    joinedDate: string;
};
// src/api/types/user.api.ts
export type CommunitiesMembersApi = {
    id: number;
    name: string;
    role: string
    posts: string;
    last_seen: string;
    is_active: boolean;
    joined_at: string; // ISO date
};

export function mapCommunityMembersToRowDTO(user: CommunitiesMembersApi): CommunitiesMembersRowDTO {
    return {
        id: user.id,
        name: user.name,
        role: user.role,
        posts: user.posts,
        last_seen: user.last_seen,
        status: user.is_active ? "Active" : "Inactive",
        joinedDate: new Date(user.joined_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    };
}