// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { usersHandler } from "./users.handler";
import { authHandler } from "./auth.handler";
import { moderationHandlers } from "./moderation.handler";

export const worker = setupWorker(usersHandler, authHandler, ...moderationHandlers);