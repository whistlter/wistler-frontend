// src/features/auth/store/auth.store.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { clearTokens } from "@/utils/storage";

/**
 * Domain models
 */
export type AuthUser = {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  image?: string;
};

type AuthState = {
  // State
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (payload: { user: AuthUser; accessToken: string }) => void;
  logout: () => void;
  hydrate: (payload: { user: AuthUser | null; accessToken: string | null }) => void;
};

/**
 * Auth store
 * - Single responsibility: authentication state only
 * - Persisted across refresh
 * - No API calls inside (hooks handle that)
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,

        login: ({ user, accessToken }) =>
          set(
            {
              user,
              accessToken,
              isAuthenticated: true,
            },
            false,
            "/login"
          ),

        logout: () => {
          clearTokens();
          set(
            {
              user: null,
              accessToken: null,
              isAuthenticated: false,
            },
            false,
            "/logout"
          );
        },

        hydrate: ({ user, accessToken }) =>
          set(
            {
              user,
              accessToken,
              isAuthenticated: Boolean(accessToken),
            },
            false,
            "/hydrate"
          ),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);

/**
 * Selectors
 */
export const useAuthUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);

// Atomic actions to prevent infinite loops
export const useLoginAction = () => useAuthStore((s) => s.login);
export const useLogoutAction = () => useAuthStore((s) => s.logout);