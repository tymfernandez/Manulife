import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";
import SignIn from "./UserAuth/Login/SignIn";
import SignUp from "./UserAuth/Signup/SignUp";
import Dashboard from "./Dashboard/dashboard";
import Profile from "./Profile/Profile";
import ApplicationForm from "./ApplicationForm/applicationForm";
import RecruitmentManagement from "./RecruitmentManagement/recruitmentManagement";

const ProtectedRoute = () => {
  const { user } = useAuth();
  return true ? <Outlet /> : <Navigate to="/signin" replace />;
};

const PublicRoute = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/recruitment" replace />,
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
    path: "/recruitment",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <RecruitmentManagement />,
      },
    ],
  },
]);
