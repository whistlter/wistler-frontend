import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "@/utils/storage";
import { useIsAuthenticated } from "@/features/auth/stores/auth.store";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children?: JSX.Element }) {
  const isAuthenticated = useIsAuthenticated();
  const token = getAccessToken();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}