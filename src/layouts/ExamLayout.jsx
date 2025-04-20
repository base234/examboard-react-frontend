import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ExamApi from "@/api/ExamApi";

const ExamLayout = () => {
  console.log("ExamLayout rendering");

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userType, isLoading, login } = useAuth();

  useEffect(() => {
    console.log("Auth state in ExamLayout:", {
      isAuthenticated,
      userType,
      path: location.pathname,
      isLoading
    });

    const fetchCandidateDetails = async () => {
      try {
        console.log("Fetching candidate details");
        const response = await ExamApi.get("/candidate/me");
        console.log("Candidate details response:", response);

        if (response.data.success && response.data.data) {
          const userData = {
            ...response.data.data,
            token: localStorage.getItem("exam-token")
          };

          await login(userData, "candidate");
          console.log("Candidate details updated in auth context");

          // After updating auth context, check if we need to redirect
          if (location.pathname === "/exams/login") {
            console.log("Redirecting to dashboard after successful auth");
            navigate("/exams/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error fetching candidate details:", error);
        // If there's an error, clear auth and redirect to login
        localStorage.removeItem("exam-token");
        localStorage.removeItem("exam-user");
        localStorage.removeItem("exam-userType");
        navigate("/exams/login", { replace: true });
      }
    };

    // Don't redirect while loading
    if (isLoading) {
      console.log("Still loading auth state");
      return;
    }

    // Check if we have a token but no auth state
    const examToken = localStorage.getItem("exam-token");
    if (examToken && !isAuthenticated) {
      console.log("Token found but not authenticated, fetching candidate details");
      fetchCandidateDetails();
      return;
    }

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && location.pathname !== "/exams/login") {
      console.log("Not authenticated, redirecting to login");
      navigate("/exams/login", { replace: true });
      return;
    }

    // If authenticated but not a candidate, redirect to main login
    if (isAuthenticated && userType !== "candidate" && location.pathname !== "/login") {
      console.log("Authenticated but not a candidate, redirecting to main login");
      navigate("/login", { replace: true });
      return;
    }

    // If authenticated as candidate and on login page, redirect to dashboard
    if (isAuthenticated && userType === "candidate" && location.pathname === "/exams/login") {
      console.log("Already authenticated as candidate, redirecting to dashboard");
      navigate("/exams/dashboard", { replace: true });
      return;
    }
  }, [isAuthenticated, userType, location.pathname, navigate, isLoading, login]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, show nothing (will be redirected)
  if (!isAuthenticated && location.pathname !== "/exams/login") {
    return null;
  }

  console.log("Rendering ExamLayout content");
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ExamLayout;
