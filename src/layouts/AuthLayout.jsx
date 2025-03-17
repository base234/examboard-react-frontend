import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const AuthLayout = () => {
  const { user } = useAuthContext();

  // If user is logged in, redirect to the appropriate dashboard
  if (user) {
    let redirectPath = "/dashboard";

    if (user.role === "customer") {
      redirectPath = "/dashboard";
    }

    if (user.role === "admin") {
      redirectPath = "/admin/dashboard";
    }

    return <Navigate to={redirectPath} />;
  }

  // If not logged in, render the guest routes
  return <Outlet />;
};

export default AuthLayout;
