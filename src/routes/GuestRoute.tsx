import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "@/features/auth/stores/auth.store";
import { getAccessToken } from "@/utils/storage";
import type { JSX } from "react";

/**
 * Route wrapper for pages that should only be accessible to GUESTS (not logged in).
 * If user is authenticated, it redirects them to the home page.
 */
export function GuestRoute({ children }: { children?: JSX.Element }) {
    const isAuthenticated = useIsAuthenticated();
    const token = getAccessToken();

    if (isAuthenticated && token) {
        // Redirect to dashboard or home if already logged in
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
}
