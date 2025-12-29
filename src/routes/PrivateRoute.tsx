// src/routes/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@/features/auth/stores/auth.store";
import type { JSX } from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useIsAuthenticated();
  return isAuthed ? children : <Navigate to="/login" replace />;
}