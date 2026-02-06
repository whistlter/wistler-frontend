import { formatDate } from "@/utils/helper";

// Domain Types for UI
export type UserRowDTO = {
    id: number;
    name: string;
    username: string;
    email: string;
    communities: number;
    status: string;
    joinedDate: string;
    image: string | null;
};

// API Response Types
export type UserApi = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    facebook_id: string | null;
    google_id: string | null;
    apple_id: string | null;
    country_code: string | null;
    phone: string | null;
    dob: string | null;
    gender: string | null;
    email_otp: string | null;
    phone_otp: string | null;
    email_otp_validated: boolean | null;
    phone_otp_validated: boolean | null;
    image: string | null;
    banner: string | null;
    status: string;
    country: string | null;
    refer_by_username: string | null;
    biography: string | null;
    last_active: string | null;
    is_deleted: boolean;
    createdAt: string | null;
    updatedAt: string | null;
    community_members: {
        id: number;
        status: string;
        user_id: number;
    }[];
    myCommunityCount: number;
};

export type CommunityApi = {
    id: number;
    user_id: number;
    code: string;
    image: string | null;
    title: string;
    desc: string;
    visibility: string;
    is_safe_space: boolean;
    is_member_screening: boolean;
    can_post_anonymously: boolean;
    has_post_contents: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
};

export type UserCommunityApi = {
    id: number;
    community_id: number;
    user_id: number;
    is_owner: boolean;
    status: string;
    privacy: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    communityId: number;
    userId: number;
    community: CommunityApi;
};

export type MetaApi = {
    count: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
};

export type ApiResponse<T> = {
    message: string;
    payload: T;
    status: string;
};

export type PaginatedUsers = ApiResponse<{
    users: UserApi[];
    meta: MetaApi;
}>;

export type PaginatedUserCommunities = ApiResponse<{
    userCommunitys: UserCommunityApi[];
    meta?: MetaApi;
}>;

export type SingleUserResponse = ApiResponse<{
    user: UserApi;
}>;

// Mappers
export function mapUserToRowDTO(user: UserApi): UserRowDTO {
    return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        username: user.username,
        email: user.email,
        communities: user.myCommunityCount,
        status: user.status,
        joinedDate: user.createdAt ? formatDate(user.createdAt) : "N/A",
        image: user.image,
    };
}

export type UserCommunityRowDTO = {
    id: number;
    communityId: number;
    userId: number;
    name: string;
    role: string;
    status: string;
    joinedDate: string;
};

export function mapUserCommunityToRowDTO(comm: UserCommunityApi): UserCommunityRowDTO {
    return {
        id: comm.id,
        communityId: comm.community_id,
        userId: comm.user_id,
        name: comm.community.title,
        role: comm.is_owner ? "Owner" : "Member",
        status: comm.status,
        joinedDate: comm.createdAt ? formatDate(comm.createdAt) : "N/A",
    };
}
