import { formatDate } from "@/utils/helper";

// src/dto/user-row.dto.ts
export type UserRowDTO = {
  id: number;
  name: string;
  email: string;
  communities: number;
  status: "Active" | "Inactive";
  joinedDate: string;
};

// src/api/types/user.api.ts
export type UserApi = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  communities_count: number;
  is_active: boolean;
  joined_at: string; // ISO date
};

export function mapUserToRowDTO(user: UserApi): UserRowDTO {
  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    communities: user.communities_count,
    status: user.is_active ? "Active" : "Inactive",
    joinedDate: formatDate(user.joined_at),
  };
}