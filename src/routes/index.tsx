import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { Loader } from "@/components/common/Loader";

import { AppShell } from "@/layouts/AppShell";
import { ModalDemo } from "@/components/modal";

// Lazy pages
const Login = lazy(() => import("@/pages/login/Login"));
const ForgotPassword = lazy(() => import("@/pages/login/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/login/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/users/Users"));
const Communities = lazy(() => import("@/pages/communities/Communities"));
const Moderation = lazy(() => import("@/pages/moderation/ModerationPage"));
const UserDetailsPage = lazy(() => import("@/pages/users/pages/userDetailsPage"));
const CommunityDetailsPage = lazy(() => import("@/features/communities/components/communityDetails/CommunityDetailsPage"));
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen text="Loading application..." />}>
      <Routes>

        {/* Public / Guest only routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ResetPassword />} />
        </Route>

        {/* Protected app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="community" element={<Communities />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="settings" element={<ModalDemo />} />
            <Route path="users/Details/:id" element={<UserDetailsPage />} />
            <Route path="community/Details/:id" element={<CommunityDetailsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}