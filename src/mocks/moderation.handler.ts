// src/mocks/handlers/moderation.handler.ts
import { http, HttpResponse } from "msw";
import { MODERATION_ACTIVITY_DB, MODERATION_STATS_DB } from "./moderator.mock";

const BASE_URL = "http://localhost:3000/api";

export const moderationHandlers = [
    http.get(`${BASE_URL}/moderation/stats`, () => {
        return HttpResponse.json(MODERATION_STATS_DB, { status: 200 });
    }),

    http.get(`${BASE_URL}/moderation/activities`, () => {
        return HttpResponse.json(MODERATION_ACTIVITY_DB, { status: 200 });
    }),
];