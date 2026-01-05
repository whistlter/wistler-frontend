// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { authHandlers } from "./auth.handler";
import { communitiesHandlers } from "./communities.handler";
import { usersHandler } from "./users.handler";
import { moderationHandlers } from "./moderation.handler";

export const worker = setupWorker(
    ...authHandlers,
    // ...communitiesHandlers,
    // ...usersHandler,
    ...moderationHandlers
);
