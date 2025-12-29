// src/mocks/handlers/users.handler.ts
import { http, HttpResponse } from "msw";
import { USERS_DB } from "./users.db";

export const usersHandler = http.get(
  "http://localhost:3000/api/users",
  ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const search = url.searchParams.get("search") || "";

    // Filter users based on search term
    let filteredUsers = USERS_DB;

    if (search.trim()) {
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

    return HttpResponse.json(
      {
        data: filteredUsers.slice(start, end),
        total: filteredUsers.length, // Total of filtered results
        page,
        pageSize: limit,
      },
      { status: 200 }
    );
  }
);