import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";
import SignIn from "./UserAuth/Login/SignIn";
import SignUp from "./UserAuth/Signup/SignUp";
import Dashboard from "./Dashboard/dashboard";
import Profile from "./Profile/Profile";
import ApplicationForm from "./ApplicationForm/applicationForm";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute:", { user, loading });

  if (loading)
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
        zzz Loading...
      </div>
    );

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
        zzzzz Loading...
      </div>
    );

  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
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
]);
