// src/mock/fetchUsers.mock.ts
import type { UserApi } from "@/features/users/types/user.types";
import { USERS_DB } from "./users.db";

export type UsersResponse = {
  items: UserApi[];
  page: number;
  limit: number;
  total: number;
};

export async function fetchUsersMock(
  page: number,
  limit: number,
  search?: string
): Promise<UsersResponse> {
  // simulate network delay
  await new Promise((res) => setTimeout(res, 600));

  // Filter users based on search term
  let filteredUsers = USERS_DB;

  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filteredUsers = USERS_DB.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const emailMatch = user.email.toLowerCase().includes(searchLower);
      const nameMatch = fullName.includes(searchLower);

      return nameMatch || emailMatch;
    });
  }

  // Paginate filtered results
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: filteredUsers.slice(start, end),
    page,
    limit,
    total: filteredUsers.length, // Total of filtered results
  };
}