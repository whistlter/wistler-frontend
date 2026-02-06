// src/dto/user-row.dto.ts
export type CommunitiesMembersRowDTO = {
    id: number;
    name: string;
    image: string;
    email: string;
    role: string;
    posts: number;
    last_seen: string;
    status: "Active" | "Inactive";
    joinedDate: string;
};

// API response types matching the actual backend response
export type CommunityMemberUser = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    image: string;
    email: string;
    last_active: string;
    status: string;
    createdAt: string;
};

export type CommunitiesMembersApi = {
    id: number;
    community_id: number;
    user_id: number;
    is_owner: boolean;
    role: string;
    status: string;
    privacy: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    communityId: number;
    userId: number;
    user: CommunityMemberUser;
    totalPostMade: number;
};

export function mapCommunityMembersToRowDTO(member: CommunitiesMembersApi): CommunitiesMembersRowDTO {
    const user = member.user;
    return {
        id: member.user_id,
        name: `${user.first_name} ${user.last_name}`,
        image: user.image,
        email: user.email,
        role: member.is_owner ? 'Owner' : member.role,
        posts: member.totalPostMade,
        last_seen: user.last_active
            ? new Date(user.last_active).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
            : 'N/A',
        status: user.status === 'active' ? "Active" : "Inactive",
        joinedDate: new Date(member.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    };
}
