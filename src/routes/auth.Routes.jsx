// Auth Routes (Accessible only if not logged in)

import AuthLayout from "@/layouts/AuthLayout";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import WriterRegister from "@/pages/auth/WriterRegister";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

const AuthRoutes = [
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ path: "", element: <Register /> }],
  },
  {
    path: "/writer/register",
    element: <AuthLayout />,
    children: [{ path: "", element: <WriterRegister /> }],
  },
  {
    path: "/forgot-password",
    element: <AuthLayout />,
    children: [{ path: "", element: <ForgotPassword /> }],
  },
  {
    path: "/reset-password/:token",
    element: <AuthLayout />,
    children: [{ path: "", element: <ResetPassword /> }],
  }
];

export default AuthRoutes;
