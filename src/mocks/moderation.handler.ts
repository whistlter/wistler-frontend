// src/mocks/handlers/moderation.handler.ts
import { http, HttpResponse } from "msw";
import { MODERATION_ACTIVITY_DB, MODERATION_STATS_DB } from "./moderator.mock";
import { FLAGGED_CONTENT_DB, REVIEW_QUEUE_DB } from "./communities.db";

export const moderationHandlers = [
    http.get("*/v1/admin/moderation/stats", () => {
        return HttpResponse.json(MODERATION_STATS_DB, { status: 200 });
    }),

    http.get("*/v1/admin/moderation/activities", () => {
        return HttpResponse.json(MODERATION_ACTIVITY_DB, { status: 200 });
    }),

    http.get("*/v1/admin/moderation/flagged", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 10);
        const search = url.searchParams.get("search") || "";

        let filtered = FLAGGED_CONTENT_DB;
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = FLAGGED_CONTENT_DB.filter((item) =>
                item.content_preview.toLowerCase().includes(searchLower) ||
                item.community_name.toLowerCase().includes(searchLower) ||
                item.reason.toLowerCase().includes(searchLower)
            );
        }

        const start = (page - 1) * limit;
        const end = start + limit;

        return HttpResponse.json(
            {
                data: filtered.slice(start, end),
                total: filtered.length,
                page,
                pageSize: limit,
            },
            { status: 200 }
        );
    }),

    http.get("*/v1/admin/moderation/review-queue", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 10);
        const search = url.searchParams.get("search") || "";

        let filtered = REVIEW_QUEUE_DB;
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = REVIEW_QUEUE_DB.filter((item) =>
                item.content.toLowerCase().includes(searchLower) ||
                item.reason.toLowerCase().includes(searchLower)
            );
        }

        const start = (page - 1) * limit;
        const end = start + limit;

        return HttpResponse.json(
            {
                data: filtered.slice(start, end),
                total: filtered.length,
                page,
                pageSize: limit,
            },
            { status: 200 }
        );
    }),
];