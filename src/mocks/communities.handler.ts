import { http, HttpResponse } from "msw";
import { COMMUNITIES_DB, COMMUNITY_MEMBERS_DB, COMMUNITY_POSTS_DB } from "./communities.db";

export const communitiesHandlers = [
    // Fetch all communities
    http.get(
        "/v1/admin/communities",
        ({ request }) => {
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") ?? 1);
            const pageSize = Number(url.searchParams.get("limit") ?? 10);
            const search = url.searchParams.get("search") || "";

            let filtered = COMMUNITIES_DB;

            if (search.trim()) {
                const searchLower = search.toLowerCase();
                filtered = COMMUNITIES_DB.filter((c) =>
                    c.community_Name.toLowerCase().includes(searchLower)
                );
            }

            const start = (page - 1) * pageSize;
            const end = start + pageSize;

            return HttpResponse.json(
                {
                    data: filtered.slice(start, end),
                    total: filtered.length,
                    page,
                    pageSize,
                },
                { status: 200 }
            );
        }
    ),

    // Fetch single community
    http.get(
        "/v1/admin/communities/:id",
        ({ params }) => {
            const { id } = params;
            const community = COMMUNITIES_DB.find((c) => c.id === Number(id));

            if (!community) {
                return HttpResponse.json(
                    { message: "Community not found" },
                    { status: 404 }
                );
            }

            return HttpResponse.json(community, { status: 200 });
        }
    ),

    // Create community
    http.post(
        "/v1/admin/communities",
        async ({ request }) => {
            const body = await request.json() as any;
            const newCommunity = {
                id: COMMUNITIES_DB.length + 1,
                community_Name: body.community_Name,
                Members: "0",
                Visibility: body.Visibility,
                is_active: true,
                joined_at: new Date().toISOString(),
            };
            COMMUNITIES_DB.unshift(newCommunity);
            return HttpResponse.json(newCommunity, { status: 201 });
        }
    ),

    // Update community
    http.put(
        "/v1/admin/communities/:id",
        async ({ params, request }) => {
            const { id } = params;
            const body = await request.json() as any;
            const index = COMMUNITIES_DB.findIndex((c) => c.id === Number(id));

            if (index !== -1) {
                COMMUNITIES_DB[index] = {
                    ...COMMUNITIES_DB[index],
                    community_Name: body.community_Name,
                    Visibility: body.Visibility,
                };
                return HttpResponse.json(COMMUNITIES_DB[index], { status: 200 });
            }

            return HttpResponse.json(
                { message: "Community not found" },
                { status: 404 }
            );
        }
    ),

    // Fetch community members
    http.get(
        "/v1/admin/communities/:id/members",
        () => {
            return HttpResponse.json(
                {
                    data: COMMUNITY_MEMBERS_DB,
                    total: COMMUNITY_MEMBERS_DB.length,
                },
                { status: 200 }
            );
        }
    ),

    // Fetch community posts
    http.get(
        "/v1/admin/communities/:id/posts",
        () => {
            return HttpResponse.json(
                {
                    data: COMMUNITY_POSTS_DB,
                    total: COMMUNITY_POSTS_DB.length,
                },
                { status: 200 }
            );
        }
    ),
];
