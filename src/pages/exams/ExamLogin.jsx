import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExamApi from "@/api/ExamApi";
import { useAuth } from "@/contexts/AuthContext";

const ExamLogin = () => {
  console.log("ExamLogin component rendering");

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    candidate_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only redirect if we're authenticated and on the login page
    if (auth.isAuthenticated && auth.userType === "candidate" && location.pathname === "/exams/login") {
      console.log("Already authenticated, redirecting to dashboard");
      navigate("/exams/dashboard", { replace: true });
    }
  }, [auth.isAuthenticated, auth.userType, location.pathname, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", formData);
      const response = await ExamApi.post("/candidate/login", formData);
      console.log("Login response:", response);

      if (response.data.success && response.data.data) {
        const userData = {
          ...response.data.data,
          token: response.data.data.token
        };

        try {
          await auth.login(userData, "candidate");
          console.log("Login successful, redirecting to dashboard");

          // Verify the auth state was set correctly
          if (auth.isAuthenticated && auth.userType === "candidate") {
            navigate("/exams/dashboard", { replace: true });
          } else {
            console.error("Auth state not set correctly after login");
            setError("Login successful but authentication state not set correctly. Please try again.");
          }
        } catch (loginError) {
          console.error("Auth context login error:", loginError);
          setError("Failed to process login. Please try again.");
        }
      } else {
        setError(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Exam Candidate Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="candidate_id" className="sr-only">
                Candidate ID
              </label>
              <input
                id="candidate_id"
                name="candidate_id"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Candidate ID"
                value={formData.candidate_id}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamLogin;
