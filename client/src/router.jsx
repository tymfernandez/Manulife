import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./lib/authContext";
import SignIn from "./UserAuth/Login/signIn";
import SignUp from "./UserAuth/Signup/signUp";
import Dashboard from "./Dashboard/dashboard";
import Profile from "./Profile/profile";
import ApplicationForm from "./ApplicationForm/applicationForm";
import TestAccountManagement from "./testAccountManagement";
import RecruitmentManagement from "./RecruitmentManagement/recruitmentManagement";

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
    path: "/test-accounts",
    element: <TestAccountManagement />,
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
  }
]);
