// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { authHandlers } from "./auth.handler";
import { moderationHandlers } from "./moderation.handler";

export const worker = setupWorker(
    ...authHandlers,
    ...moderationHandlers
);
