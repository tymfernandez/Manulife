import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components for better performance
const SignIn = lazy(() => import("./UserAuth/Login/SignIn"));
const SignUp = lazy(() => import("./UserAuth/Signup/signup"));
const ForgotPassword = lazy(() => import("./UserAuth/Login/ForgotPassword"));
const Dashboard = lazy(() => import("./Dashboard/dashboard"));
const Profile = lazy(() => import("./Profile/Profile"));
const ApplicationForm = lazy(() => import("./ApplicationForm/applicationForm"));
const AccountManagement = lazy(() => import("./AccountManagement/accountManagement"));
const RecruitmentManagement = lazy(() => import("./RecruitmentManagement/recruitmentManagement"));
const ActivityLogs = lazy(() => import("./ActivityLogs/activityLogs"));
const Settings = lazy(() => import("./Settings/settings"));
const PasswordReset = lazy(() => import("./components/PasswordReset"));
const LandingPage = lazy(() => import("./LandingPage/landingPage"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

const AuthProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/signin",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignIn />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignUp />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/reset-password",
    element: <PasswordReset />,
  },
  {
    path: "/dashboard",
    element: <AuthProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute
            requiredRoles={[
              "FA",
              "BH",
              "UH",
              "UHA",
              "Region Head",
              "Sys Admin",
            ]}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/profile",
    element: <AuthProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute
            requiredRoles={[
              "FA",
              "BH",
              "UH",
              "UHA",
              "Region Head",
              "Sys Admin",
            ]}
          >
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/application-form",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <ApplicationForm />,
      },
    ],
  },
  {
    path: "/account-management",
    element: <AuthProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRoles={["Region Head", "Sys Admin"]}>
            <AccountManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/recruitment",
    element: <AuthProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute
            requiredRoles={["BH", "UH", "UHA", "Region Head", "Sys Admin"]}
          >
            <RecruitmentManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/activity-logs",
    element: <AuthProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRoles={["Region Head", "Sys Admin"]}>
            <ActivityLogs />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/settings",
    element: <AuthProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute
            requiredRoles={[
              "FA",
              "BH",
              "UH",
              "UHA",
              "Region Head",
              "Sys Admin",
            ]}
          >
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
