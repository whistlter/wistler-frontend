// src/dto/user-row.dto.ts
export type CommunitiesRowDTO = {
    id: number;
    Community_Name: string;
    description: string;
    members: string;
    visibility: string;
    status: "Active" | "in-active";
    joinedDate: string;
    image: string | null;
    user_id: number;
    interest_id?: number;
    community_interests?: Array<{
        interest_id: number;
        interest: {
            id: number;
            title: string;
        };
    }>;
};

// src/api/types/user.api.ts - Updated to match actual API response
export type CommunitiesApi = {
    id: number;
    user_id: number;
    code: string;
    image: string | null;
    title: string;
    desc?: string;
    visibility?: string;
    interest_id?: number;
    is_safe_space?: boolean;
    is_member_screening?: boolean;
    can_post_anonymously?: boolean;
    has_post_contents?: boolean;
    is_deleted?: boolean;
    is_suspended?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    members_count?: number;
    myCommunityCount?: number;
    community_interests?: Array<{
        id: number;
        community_id: number;
        interest_id: number;
        createdAt: string;
        updatedAt: string;
        communityId: number;
        interestId: number;
        interest: {
            id: number;
            title: string;
            image: string | null;
        };
    }>;
};

export function mapCommunityToRowDTO(community: CommunitiesApi): CommunitiesRowDTO {
    let status: "Active" | "in-active" = "Active";

    // Determine status: check for suspended, in-active from API, or deleted
    if (community.is_suspended || community.status === 'in-active' || community.is_deleted) {
        status = "in-active";
    }

    return {
        id: community.id,
        Community_Name: community.title,
        description: community.desc || "",
        members: (community.myCommunityCount ?? community.members_count ?? 0).toString(),
        visibility: community.visibility || "Public",
        status,
        joinedDate: community.createdAt
            ? new Date(community.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
            : "N/A",
        image: community.image,
        user_id: community.user_id,
        interest_id: community.interest_id,
        community_interests: community.community_interests,
    };
}