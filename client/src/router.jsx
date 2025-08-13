import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./lib/authContext";
import SignIn from "./UserAuth/Login/SignIn";
import SignUp from "./UserAuth/Signup/signUp";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/profile";
import ApplicationForm from "./ApplicationForm/applicationForm";
import AccountManagement from "./AccountManagement/accountManagement";
import RecruitmentManagement from "./RecruitmentManagement/recruitmentManagement";
import ActivityLogs from "./ActivityLogs/activityLogs";

const ProtectedRoute = () => {
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
    element: <Navigate to="/signin" replace />,
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
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/profile",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
    ],
  },
  {
    path: "/application-form",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <ApplicationForm />,
      },
    ],
  },
  {
    path: "/account-management",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AccountManagement />,
      },
    ],
  },
  {
  path: "/recruitment",
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: <RecruitmentManagement />,
    },
  ],
},
{
  path: "/activity-logs",
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: <ActivityLogs />,
    },
  ],
},
{
  path: "/settings",
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: (
        <div className="bg-gray-100 min-h-screen p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            This section is under development.
          </p>
        </div>
      ),
    },
  ],
}
]);
