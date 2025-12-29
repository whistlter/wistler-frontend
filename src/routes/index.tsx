import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Loader } from "@/components/common/Loader";
import { AppShell } from "@/components/layout/AppShell";
import { ModalDemo } from "@/components/modal";

// Lazy pages
const Login = lazy(() => import("@/pages/login/Login"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/users/Users"));
const Communities = lazy(() => import("@/pages/communities/Communities"));
const Moderation = lazy(() => import("@/pages/moderation/ModerationPage"));
const UserDetailsPage = lazy(() => import("@/pages/users/pages/userDetailsPage"));
const CommunityDetailsPage = lazy(() => import("@/pages/communities/components/communityDetails/CommunityDetailsPage"));
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export default function AppRoutes() {
  return (
    // <Suspense fallback={<Loader fullScreen text="Loading application..." />}>
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />

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
    // {/* </Suspense> */}
  );
}