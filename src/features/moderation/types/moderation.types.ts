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