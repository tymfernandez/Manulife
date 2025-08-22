import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./UserAuth/Login/SignIn";
import SignUp from "./UserAuth/Signup/signup";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/profile";
import ApplicationForm from "./ApplicationForm/applicationForm";
import AccountManagement from "./AccountManagement/accountManagement";
import RecruitmentManagement from "./RecruitmentManagement/recruitmentManagement";
import ActivityLogs from "./ActivityLogs/activityLogs";
import Settings from "./Settings/settings";
import LandingPage from "./LandingPage/landingPage";

const AuthProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute:", { user, loading });

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
    element: <LandingPage />,
  },
  {
    path: "/signin",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
    ],
  },
  {
    path: "/signup",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <SignUp />,
      },
    ],
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
            <Dashboard />
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
