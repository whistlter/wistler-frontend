import { http, HttpResponse } from "msw";
import { USERS_DB } from "./users.db";
import { USER_COMMUNITIES_DB } from "./communities.db";

export const usersHandler = [
    // Fetch all users
    http.get(
        "/v1/admin/users",
        ({ request }) => {
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") ?? 1);
            const pageSize = Number(url.searchParams.get("pageSize") ?? 30);
            const search = url.searchParams.get("search") || "";

            // Filter users based on search term
            let filteredUsers = USERS_DB;

            if (search.trim()) {
                const searchLower = search.toLowerCase();
                filteredUsers = USERS_DB.filter((user) => {
                    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                    const emailMatch = user.email.toLowerCase().includes(searchLower);
                    const nameMatch = fullName.includes(searchLower);
                    const usernameMatch = user.username.toLowerCase().includes(searchLower);

                    return nameMatch || emailMatch || usernameMatch;
                });
            }

            // Paginate filtered results
            const start = (page - 1) * pageSize;
            const end = start + pageSize;

            return HttpResponse.json(
                {
                    message: "user fetched successfully",
                    payload: {
                        users: filteredUsers.slice(start, end),
                        meta: {
                            count: filteredUsers.length,
                            totalPages: Math.ceil(filteredUsers.length / pageSize),
                            currentPage: page,
                            perPage: pageSize,
                        }
                    },
                    status: "success"
                },
                { status: 200 }
            );
        }
    ),

    // Fetch single user
    http.get(
        "/v1/admin/users/:userId",
        ({ params }) => {
            const { userId } = params;
            const user = USERS_DB.find(u => u.id === Number(userId));

            if (!user) {
                return HttpResponse.json(
                    { message: "User not found", status: "error" },
                    { status: 404 }
                );
            }

            return HttpResponse.json(
                {
                    message: "user fetched successfully",
                    payload: { user },
                    status: "success"
                },
                { status: 200 }
            );
        }
    ),

    // Fetch user communities
    http.get(
        "/v1/admin/users/:userId/community",
        ({ request }) => {
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") ?? 1);
            const pageSize = Number(url.searchParams.get("pageSize") ?? 30);

            // Filtering by userId in a real scenario, but here we just use USER_COMMUNITIES_DB
            // For mock consistency, let's filter if needed, but existing logic used USER_COMMUNITIES_DB directly
            const filtered = USER_COMMUNITIES_DB;

            const start = (page - 1) * pageSize;
            const end = start + pageSize;

            return HttpResponse.json(
                {
                    message: "community fetched successfully",
                    payload: {
                        userCommunitys: filtered.slice(start, end),
                    },
                    status: "success"
                },
                { status: 200 }
            );
        }
    ),

    // Block user
    http.patch(
        "/v1/admin/users/:userId/status/blocked",
        ({ params }) => {
            const { userId } = params;
            const userIndex = USERS_DB.findIndex(u => u.id === Number(userId));

            if (userIndex !== -1) {
                USERS_DB[userIndex].status = "blocked";
            }

            return HttpResponse.json(
                {
                    message: "User blocked successfully",
                    status: "success"
                },
                { status: 200 }
            );
        }
    ),

    // Reset password
    http.patch(
        "/v1/admin/users/:userId/reset-password",
        () => {
            return HttpResponse.json(
                {
                    message: "Password reset instructions sent successfully",
                    status: "success"
                },
                { status: 200 }
            );
        }
    ),
];
