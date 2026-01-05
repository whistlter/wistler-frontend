import { http, passthrough } from "msw";

// All authentication mocks have been removed to use the real backend.
// We keep an explicit passthrough for these routes just in case, 
// though removing them from the worker setup is the primary way to disable them.
export const authHandlers = [
  http.all("*/v1/admin/auth/*", () => passthrough()),
  http.all("*/v1/admin/forget-password/*", () => passthrough()),
];