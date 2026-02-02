import { http, HttpResponse } from "msw";
import { COMMUNITIES_DB, COMMUNITY_MEMBERS_DB, COMMUNITY_POSTS_DB } from "./communities.db";
import type { CommunitiesApi } from "@/features/communities/types/community.types";

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
                    c.title.toLowerCase().includes(searchLower)
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
            const body = await request.json() as Record<string, unknown>;
            const newCommunity: CommunitiesApi = {
                id: COMMUNITIES_DB.length + 1,
                user_id: body.user_id || 1,
                code: `COMM${COMMUNITIES_DB.length + 1}`,
                image: body.image || null,
                title: body.title || body.community_Name,
                desc: body.desc || "",
                visibility: body.visibility || "public",
                is_safe_space: false,
                is_member_screening: false,
                can_post_anonymously: true,
                has_post_contents: false,
                is_deleted: false,
                is_suspended: false,
                status: "active",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                members_count: 0,
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
            const body = await request.json() as Record<string, unknown>;
            const index = COMMUNITIES_DB.findIndex((c) => c.id === Number(id));

            if (index !== -1) {
                COMMUNITIES_DB[index] = {
                    ...COMMUNITIES_DB[index],
                    title: body.title || body.community_Name,
                    visibility: body.visibility || body.Visibility,
                    updatedAt: new Date().toISOString(),
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
